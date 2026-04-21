import { NextFunction, Response } from 'express';
import { AuthenticatedRequest } from '../../middleware/requireAuth';
import ConversationModel from '../../model/Conversation';
import UserConversationModel from '../../model/UserConversation';

export default async function getAllConversations(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user._id;

    const conversations = await UserConversationModel.find({ user:userId })
      .populate('lastMessage', 'content createdAt senderId')
      .sort({ updatedAt: -1 });

    if (!conversations) {
      return res.status(404).json({
        status: 'error',
        message: 'No conversations found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Conversations retrieved successfully',
      data: conversations
    });

  } catch (error) {
    next(error);
  }
}
