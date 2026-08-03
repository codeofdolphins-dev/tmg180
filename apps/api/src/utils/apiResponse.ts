import { Response } from "express"

export class ApiResponse<T> {
    constructor(
        public statusCode: number,
        public message = "success",
        public data: T,
        public success?: boolean
    ) {
        this.success = this.statusCode < 400
    }
};

export class ApiError extends Error {
    public success = false;
    constructor(
        public statusCode: number,
        public message = "Something went wrong!!!",
        public data: unknown = null,
        public errors: unknown[] = [],
        // Stable machine-readable code. @tmg180/api-client switches on this,
        // so it travels in the error envelope alongside the message.
        public code?: string
    ) {
        super(message);
    }
};

export const catchResponse = (error: unknown, res: Response) => {
    if (error instanceof ApiError) return res.status(error.statusCode).json(error);
    if (error instanceof Error) return res.status(500).json(new ApiError(500, error.message));
    return res.status(500).json(new ApiError(500, "something went wrong"));
};