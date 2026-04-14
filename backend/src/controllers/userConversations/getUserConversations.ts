import { NextFunction, Response } from 'express';
import { AuthenticatedRequest } from '../../middleware/requireAuth';
import UserConversationModel from '../../model/UserConversation';

export const getUserConversations = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user._id;

    const userConversations = await UserConversationModel.find({ user: userId })
      .populate('user', 'firstName lastName email formattedText _id')
      .populate('lastMessage')
      .sort({ updatedAt: -1 });

    return res.status(200).json({
      userConversations,
      status: 'success',
      message: 'Conversations retrieved successfully'
    });

  } catch (error) {
    console.error('Error getting conversations:', error);
    next(error);
  }
};
