import { NextFunction, Response } from 'express';
import { AuthenticatedRequest } from '../../middleware/requireAuth';
import MessageModel from '../../model/Message';

export default async function getMessages(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { room_id } = req.params;
    const userId = req.user._id;

    const messages = await MessageModel.find({ roomId: room_id })
      .populate('senderId', 'firstName lastName formattedText _id imageUrl')
      .sort({ createdAt: 1 });

    if (!messages) {
      return res.status(404).json({
        status: 'error',
        message: 'No messages found for this conversation'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Messages retrieved successfully',
      data: messages
    });

  } catch (error) {
    next(error);
  }
}
