import { NextFunction, Response } from 'express';
import { AuthenticatedRequest } from '../../middleware/requireAuth';
import ConversationModel from '../../model/Conversation';
import UserModel from '../../model/User';

export default async function initiateConversation(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user.id;
    const { recipientId } = req.body;

    const user = await UserModel.findById(userId);
    const recipient = await UserModel.findById(recipientId);

    if (!user || !recipient) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    let room = await ConversationModel.findOne({
      roomType: 'p2p',
      members: { $all: [userId, recipientId], $size: 2 }
    });

    if (!room) {
      room = new ConversationModel({
        name: `${user.firstName} & ${recipient.firstName}`,
        members: [userId, recipientId],
        roomType: 'p2p'
      });
      await room.save();
    }

    await room.populate('members', 'firstName lastName formattedText _id');

    res.status(201).json({
      status: 'success',
      message: 'Conversation initiated',
      data: room
    });

  } catch (error) {
    next(error);
  }
}
