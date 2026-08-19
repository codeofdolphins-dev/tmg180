import type { Request } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {
    ACCOUNT_STATUS,
    SELF_SIGNUP_ROLES,
    checkPassword,
    consentRecord,
    isRole,
    isValidEmail,
    missingConsents,
    sortRoles,
} from '@tmg180/shared';
import { prisma } from '../config/prisma.js';
import { ApiError, ApiResponse, catchResponse } from '../utils/apiResponse.js';
import { badRequest, unauthorized } from '../middleware/errors.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendPasswordResetEmail } from '../services/mailer.js';
import { decodeResetToken, signAccessToken, signResetToken } from '../services/tokens.js';
import {
    issueRefreshToken,
    revokeAllRefreshTokens,
    revokeRefreshToken,
    rotateRefreshToken,
} from '../services/refreshTokens.js';
import { asInet } from '../utils/clientInfo.js';
import { hashPassword } from '../helper/hashPassword.js';

/** Everything the token and the client need; never the password hash. */
const ACCOUNT_SELECT = {
    id: true,
    email: true,
    full_name: true,
    roles: true,
    status: true,
} as const;

type Account = {
    id: number;
    email: string;
    full_name: string;
    roles: string[];
    status: string;
};


/**
 * What sign-in, sign-up and refresh all hand back. The access token is the
 * 15-minute credential every request carries; the refresh token is the
 * long-lived one that buys the next access token and is the only half the
 * server can revoke.
 */
async function issueSession(req: Request, user: Account) {
    return {
        accessToken: signAccessToken(user),
        refreshToken: await issueRefreshToken(req, user.id),
    };
}

const toPublicUser = (user: Account) => ({
    id: user.id,
    email: user.email,
    name: user.full_name,
    roles: sortRoles(user.roles),
});

/** Suspension and a workspace-less account are distinct, actionable states. */
function assertUsable(user: Account) {
    if (user.status === ACCOUNT_STATUS.SUSPENDED) {
        throw new ApiError(
            403,
            'This account is suspended. Contact TMG180 support.'
        );
    }
    if (sortRoles(user.roles).length === 0) {
        throw new ApiError(
            403,
            "This account doesn't have a workspace yet. Contact TMG180 support."
        );
    }
}

/** Auth events are compliance evidence, so they go in the append-only log. */
function writeAudit(
    req: Request,
    entry: { actorId: number; actorRole?: string; action: string; details?: object }
) {
    return prisma.auditLog.create({
        data: {
            actor_id: entry.actorId,
            actor_role: entry.actorRole ?? null,
            action: entry.action,
            target_type: 'user',
            target_id: entry.actorId,
            details: entry.details ?? undefined,
            ip_address: asInet(req.ip),
        },
    });
}




export const signUp = asyncHandler(async (req, res) => {
    const { full_name, email, password, role, consents } = (req.body ?? {}) as {
        full_name: string;
        email: string;
        password: string;
        role?: string;
        consents?: Record<string, boolean>;
    };

    if ([full_name, email, password].some(e => e?.trim() === "")) throw new ApiError(400, 'Required fields are missing!!!');

    if (!isRole(role) || !SELF_SIGNUP_ROLES.includes(role)) {
        throw badRequest('Choose whether you are joining as a participant or a support worker.');
    }

    const outstanding = missingConsents(consents ?? {});
    if (outstanding.length > 0) {
        throw badRequest('Please agree to the terms before creating your account.', {
            missing: outstanding,
        });
    }

    const password_hash = await hashPassword(password)

    let user: Account;
    try {
        user = await prisma.user.create({
            data: {
                email,
                password_hash,
                full_name: full_name,
                roles: [role],
                status: ACCOUNT_STATUS.ACTIVE,
            },
            select: ACCOUNT_SELECT,
        });
    } catch (error) {
        // P2002 = unique violation. Checking first would still race, so let the
        // index decide and translate the failure.
        if ((error as { code?: string }).code === 'P2002') {
            throw new ApiError(409, 'An account with this email already exists.');
        }
        throw error;
    }

    // Append-only proof of what was agreed and at which wording version.
    await writeAudit(req, {
        actorId: user.id,
        actorRole: role,
        action: 'account_created',
        details: { self_signup: true, consents: consentRecord(consents ?? {}) },
    });

    res.status(201).json(new ApiResponse(
        201,
        "account created successfully",
        { user: toPublicUser(user), ...(await issueSession(req, user)) }
    ));
});

export const signIn = asyncHandler(async (req, res) => {
    try {
        const { email, password } = (req.body ?? {}) as { email?: string; password?: string };
        if (!email || !password) {
            throw new ApiError(400, 'Email and password are required.');
        }

        // Stored lowercased on write, so the unique index does the lookup.
        const user = await prisma.user.findUnique({
            where: { email },
            select: { ...ACCOUNT_SELECT, password_hash: true },
        });
        if (!user) throw new ApiError(400, 'Email not registered!!!');

        const valid = await bcrypt.compare(password, user.password_hash as string);

        // An invited account has no hash yet — bcrypt.compare against null would
        // throw, so the nullish fallback above keeps it on the same failure path.
        if (!user || !user.password_hash || !valid) throw new ApiError(401, 'Email or password is incorrect.');
        assertUsable(user);

        await prisma.user.update({
            where: { id: user.id },
            data: { last_login_at: new Date() },
        });

        res.json(new ApiResponse(
            200,
            "log in successful",
            { user: toPublicUser(user), ...(await issueSession(req, user)) }
        ));

    } catch (error: unknown) {
        catchResponse(error, res);
    }
});

export const me = asyncHandler(async (req, res) => {
    if (!req.user) throw unauthorized();

    const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: ACCOUNT_SELECT,
    });
    if (!user) throw new ApiError(404, 'Account no longer exists.');
    assertUsable(user);

    res.json(new ApiResponse(200, "account fetch successfully", toPublicUser(user)));
});

/**
 * PATCH /auth/me — the only thing an account holder can change about the
 * account itself today: the name they are known by. Email is a credential
 * (changing it is a verification flow, not a text field) and roles are
 * server-issued, so neither is editable here.
 */
export const updateMe = asyncHandler(async (req, res) => {
    if (!req.user) throw unauthorized();

    const { full_name } = (req.body ?? {}) as { full_name?: unknown };
    if (typeof full_name !== 'string' || full_name.trim() === '') {
        throw new ApiError(400, 'Enter the name you would like to be known by.', {
            full_name: 'Your name cannot be empty.',
        });
    }
    if (full_name.trim().length > 255) {
        throw new ApiError(400, 'That name is too long.', {
            full_name: 'Your name must be 255 characters or fewer.',
        });
    }

    const user = await prisma.user.update({
        where: { id: req.user.id },
        data: { full_name: full_name.trim() },
        select: ACCOUNT_SELECT,
    });
    assertUsable(user);

    res.json(new ApiResponse(200, 'account updated', toPublicUser(user)));
});

/**
 * Trades a refresh token for a fresh pair. Deliberately unauthenticated — the
 * refresh token IS the credential, and the whole point is that it works when
 * the access token has already expired.
 *
 * This is also the checkpoint the stateless access token cannot be: an account
 * suspended or stripped of its roles mid-session gets no further tokens here,
 * so the change takes effect within one access-token lifetime.
 */
export const refresh = asyncHandler(async (req, res) => {
    const { refreshToken } = (req.body ?? {}) as { refreshToken?: string };
    if (!refreshToken) throw unauthorized('A refresh token is required.');

    const rotated = await rotateRefreshToken(req, refreshToken);

    const user = await prisma.user.findUnique({
        where: { id: rotated.userId },
        select: ACCOUNT_SELECT,
    });

    // The account went away or is no longer usable — do not leave a live
    // refresh chain behind for it.
    if (!user) {
        await revokeAllRefreshTokens(rotated.userId);
        throw unauthorized('Your session has ended. Please sign in again.');
    }
    try {
        assertUsable(user);
    } catch (error) {
        await revokeAllRefreshTokens(user.id);
        throw error;
    }

    res.json(new ApiResponse(200, "session refreshed", {
        user: toPublicUser(user),
        accessToken: signAccessToken(user),
        refreshToken: rotated.token,
    }));
});

/**
 * Ends the session the given refresh token belongs to. Always 204: the client
 * has already dropped its tokens by the time this lands, and whether the token
 * was real is not something an unauthenticated caller gets told.
 */
export const signOut = asyncHandler(async (req, res) => {
    const { refreshToken } = (req.body ?? {}) as { refreshToken?: string };
    if (refreshToken) await revokeRefreshToken(refreshToken);
    res.status(204).end();
});

/**
 * Always 204, whether or not the address has an account. Telling an anonymous
 * caller which emails are registered is exactly the enumeration this avoids.
 */
export const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = (req.body ?? {}) as { email?: string };
    if (!isValidEmail(email ?? '')) {
        throw new ApiError(400, 'Enter a valid email address.');
    }

    const user = await prisma.user.findUnique({
        where: { email },
        select: { id: true, email: true, status: true },
    });

    if (user && user.status !== ACCOUNT_STATUS.SUSPENDED) {
        const token = signResetToken(user);
        await writeAudit(req, { actorId: user.id, action: 'password_reset_requested' });
        await sendPasswordResetEmail(user.email, token);
    }

    res.status(204).end();
});

/** Distinguishes "expired" from "invalid" so the reset screen can say which. */
const decodeUsableReset = (token: string) => {
    try {
        return decodeResetToken(token);
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            throw new ApiError(400, 'This reset link has expired.');
        }
        throw new ApiError(
            400,
            'This reset link is no longer valid.'
        );
    }
};

/** Lets the reset screen show Link Expired before asking for a new password. */
export const verifyResetToken = asyncHandler(async (req, res) => {
    const { token } = req.params as { token?: string };
    if (!token) throw badRequest('A reset token is required.');

    decodeUsableReset(token);
    res.json({ valid: true });
});

export const resetPassword = asyncHandler(async (req, res) => {
    const { token, password } = (req.body ?? {}) as { token?: string; password: string };
    if (!token) throw badRequest('A reset token is required.');
    
    if (!checkPassword(password ?? '').isValid) throw new ApiError(400, 'Password does not meet the requirements.');

    const userId = decodeUsableReset(token);
    const password_hash = await hashPassword(password);

    await prisma.user.update({ where: { id: userId }, data: { password_hash } });
    // Changing the password is how someone locks an intruder out, so every
    // session opened with the old one has to end with it.
    await revokeAllRefreshTokens(userId);
    await writeAudit(req, { actorId: userId, action: 'password_reset_completed' });

    res.status(204).end();
});
