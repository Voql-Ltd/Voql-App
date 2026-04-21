import { NextFunction, Response } from 'express';
import { AuthenticatedRequest } from '../../middleware/requireAuth';
import ConversationModel from '../../model/Conversation';

export default async function getAConversation(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { room_id } = req.params;
    const { room_type } = req.query;
    const userId = req.user._id;

    const query: any = { 
      _id: room_id,
      members: userId 
    };

    if (room_type) {
      query.roomType = room_type;
    }

    const conversation = await ConversationModel.findOne(query)
      .populate('members', 'firstName lastName formattedText _id imageUrl');

    if (!conversation) {
      return res.status(404).json({
        status: 'error',
        message: 'Conversation not found or access denied'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Conversation retrieved successfully',
      data: conversation
    });

  } catch (error) {
    next(error);
  }
}