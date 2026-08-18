import { prisma } from "../config/prisma.js";
import { ApiResponse, catchResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getWorkerList = asyncHandler(async (req, res) => {
    try {

        const user = await prisma.user.findMany({
            where: {
                roles: {
                    has: "worker"
                }
            },
            omit: {
                password_hash: true
            }
        });

        return res.json(new ApiResponse(200, "worker list fetch successfully", user));
        
    } catch (error) {
        catchResponse(error, res);
    }
});