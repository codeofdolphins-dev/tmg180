import type { Request } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {
    ACCOUNT_STATUS,
    AUTH_ERROR,
    SELF_SIGNUP_ROLES,
    checkPassword,
    consentRecord,
    isRole,
    isValidEmail,
    missingConsents,
    normaliseEmail,
    sortRoles,
} from '@tmg180/shared';
import { prisma } from '../config/prisma.js';
import { ApiError, catchResponse } from '../utils/apiResponse.js';
import { badRequest, unauthorized } from '../middleware/errors.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendPasswordResetEmail } from '../services/mailer.js';
import { decodeResetToken, signAccessToken, signResetToken } from '../services/tokens.js';

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
 * Compared against when the account is missing, so response timing does not
 * reveal which addresses have accounts.
 */
const DUMMY_HASH = '$2a$10$invalidinvalidinvalidinvalidinvalidinvalidinvalidinvalidiu';

/**
 * Cost 12: ~250ms on commodity hardware, which is the point — it prices
 * offline guessing without making sign-in feel slow.
 */
const BCRYPT_ROUNDS = 12;

/** tmg_audit_log.ip_address is INET, so only store something that parses. */
const asInet = (value?: string) =>
    value && /^[0-9a-fA-F.:]+$/.test(value) ? value.replace(/^::ffff:/, '') : null;

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
            'This account is suspended. Contact TMG180 support.',
            null,
            [],
            AUTH_ERROR.ACCOUNT_SUSPENDED
        );
    }
    if (sortRoles(user.roles).length === 0) {
        throw new ApiError(
            403,
            "This account doesn't have a workspace yet. Contact TMG180 support.",
            null,
            [],
            AUTH_ERROR.NO_WORKSPACE
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

/**
 * Self-service account creation.
 *
 * Deliberately thin: name, email, password, workspace, consent. Everything
 * else about a person is gathered inside their workspace, where they own it
 * and control its visibility (Handoff P1-01/P1-03) — an account is not the
 * place to accumulate participant record content (Technical Brief §7).
 *
 * Admin accounts are never self-served; SELF_SIGNUP_ROLES is the gate.
 */
export const signUp = asyncHandler(async (req, res) => {
    const { name, email, password, role, consents } = (req.body ?? {}) as {
        name?: string;
        email?: string;
        password?: string;
        role?: string;
        consents?: Record<string, boolean>;
    };

    const fullName = name?.trim();
    if (!fullName) throw badRequest('Your name is required.');
    if (!isValidEmail(email ?? '')) {
        throw new ApiError(400, 'Enter a valid email address.', null, [], AUTH_ERROR.INVALID_EMAIL);
    }
    if (!checkPassword(password ?? '').isValid) {
        throw new ApiError(
            400,
            'Password does not meet the requirements.',
            null,
            [],
            AUTH_ERROR.WEAK_PASSWORD
        );
    }
    if (!isRole(role) || !SELF_SIGNUP_ROLES.includes(role)) {
        throw badRequest('Choose whether you are joining as a participant or a support worker.');
    }

    const outstanding = missingConsents(consents ?? {});
    if (outstanding.length > 0) {
        throw badRequest('Please agree to the terms before creating your account.', {
            missing: outstanding,
        });
    }

    const password_hash = await bcrypt.hash(password as string, BCRYPT_ROUNDS);

    let user: Account;
    try {
        user = await prisma.user.create({
            data: {
                email: normaliseEmail(email as string),
                password_hash,
                full_name: fullName,
                roles: [role],
                status: ACCOUNT_STATUS.ACTIVE,
            },
            select: ACCOUNT_SELECT,
        });
    } catch (error) {
        // P2002 = unique violation. Checking first would still race, so let the
        // index decide and translate the failure.
        if ((error as { code?: string }).code === 'P2002') {
            throw new ApiError(
                409,
                'An account with this email already exists.',
                null,
                [],
                AUTH_ERROR.EMAIL_TAKEN
            );
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

    res.status(201).json({ user: toPublicUser(user), accessToken: signAccessToken(user) });
});

export const signIn = asyncHandler(async (req, res) => {
    try {
        const { email, password } = (req.body ?? {}) as { email?: string; password?: string };
        if (!email || !password) {
            throw badRequest('Email and password are required.');
        }

        // Stored lowercased on write, so the unique index does the lookup.
        const user = await prisma.user.findUnique({
            where: { email: normaliseEmail(email) },
            select: { ...ACCOUNT_SELECT, password_hash: true },
        });
        if (!user) throw new ApiError(400, 'Email not registered!!!');

        const valid = await bcrypt.compare(password, user?.password_hash ?? DUMMY_HASH);

        // An invited account has no hash yet — bcrypt.compare against null would
        // throw, so the nullish fallback above keeps it on the same failure path.
        if (!user || !user.password_hash || !valid) throw new ApiError(401, 'Email or password is incorrect.');
        assertUsable(user);

        await prisma.user.update({
            where: { id: user.id },
            data: { last_login_at: new Date() },
        });

        res.json({ user: toPublicUser(user), accessToken: signAccessToken(user) });

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
    if (!user) throw unauthorized('Account no longer exists.');
    assertUsable(user);

    res.json(toPublicUser(user));
});

/**
 * Always 204, whether or not the address has an account. Telling an anonymous
 * caller which emails are registered is exactly the enumeration this avoids.
 */
export const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = (req.body ?? {}) as { email?: string };
    if (!isValidEmail(email ?? '')) {
        throw new ApiError(400, 'Enter a valid email address.', null, [], AUTH_ERROR.INVALID_EMAIL);
    }

    const user = await prisma.user.findUnique({
        where: { email: normaliseEmail(email as string) },
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
            throw new ApiError(400, 'This reset link has expired.', null, [], AUTH_ERROR.TOKEN_EXPIRED);
        }
        throw new ApiError(
            400,
            'This reset link is no longer valid.',
            null,
            [],
            AUTH_ERROR.INVALID_TOKEN
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
    const { token, password } = (req.body ?? {}) as { token?: string; password?: string };
    if (!token) throw badRequest('A reset token is required.');
    if (!checkPassword(password ?? '').isValid) {
        throw new ApiError(
            400,
            'Password does not meet the requirements.',
            null,
            [],
            AUTH_ERROR.WEAK_PASSWORD
        );
    }

    const userId = decodeUsableReset(token);
    const password_hash = await bcrypt.hash(password as string, BCRYPT_ROUNDS);

    await prisma.user.update({ where: { id: userId }, data: { password_hash } });
    await writeAudit(req, { actorId: userId, action: 'password_reset_completed' });

    res.status(204).end();
});
