import { NextFunction, Response } from 'express';
import { AuthenticatedRequest } from '../../middleware/requireAuth';
import ConversationModel from '../../model/Conversation';

export default async function getGroupsByUser(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user.id;

    const rooms = await ConversationModel.find({
      members: userId,
      roomType: 'group'
    }).populate('members', 'firstName lastName formattedText _id');

    res.status(200).json({
      status: 'success',
      message: 'Groups retrieved',
      data: rooms
    });

  } catch (error) {
    next(error);
  }
}
