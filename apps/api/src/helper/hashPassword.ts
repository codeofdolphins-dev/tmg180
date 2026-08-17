import bcrypt from "bcryptjs";
import { env } from "../config/env.js";

export async function hashPassword(value: string): Promise<string | undefined> {
    if(!value) return;

    return await bcrypt.hash(value, env.BCRYPT_SALT);
}