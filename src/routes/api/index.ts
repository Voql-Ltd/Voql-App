import { Application, NextFunction, Request, Response } from "express";
import authRoutes from "./auth";
import userConversationsRoutes from "./userConversations";
import friendsRoutes from "./friends";
import conversationRoutes from "./conversations";
import messagesRoutes from "./messages";
import redisService from "../../services/redisService";
import consoleLog from "../../utils/consolelog";

export default function routes(app: Application): void {
    app.use("/api/v1/auth", authRoutes);
    app.use("/api/v1/friends", friendsRoutes);
    app.use("/api/v1/user-conversations", userConversationsRoutes);
    app.use("/api/v1/conversations", conversationRoutes);
    app.use("/api/v1/messages", messagesRoutes);
    
    app.get('/chunk/:filename', async (req, res) => {
        const base64Data = await redisService.readBufferRd(req.params.filename);
        
        if (!base64Data) {
            return res.status(404).json({ error: 'File not found' });
        }
        consoleLog('found on redis')
        const buffer = base64Data;
        res.set('Content-Type', 'audio/wav');
        res.send(buffer);
    });
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