import { Application, NextFunction, Request, Response } from "express";
import authRoutes from "./auth";

export default function routes(app: Application): void {
    app.use("/api/v1/auth", authRoutes);

    app.use((req: Request, res: Response, next: NextFunction) => {
        const error = new Error("Not Found") as Error & { status?: number };
        error.status = 404;
        next(error);
    });

    app.use((error: Error & { status?: number }, req: Request, res: Response, next: NextFunction) => {
        res.status(error.status || 500);
        res.json({
            error: {
                status: error.status || 500,
                message: error.message,
            },
        });
    });
}