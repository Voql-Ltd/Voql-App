import { NextFunction, Response } from 'express';
import { AuthenticatedRequest } from '../../middleware/requireAuth';
import RoomModel from '../../model/Room';

export default async function createGroupRoom(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user.id;
    const { name, members } = req.body;

    if (!members.includes(userId)) {
      members.push(userId);
    }

    const room = new RoomModel({
      name,
      members,
      roomType: 'group'
    });

    await room.save();
  
    res.status(201).json({
      status: 'success',
      message: 'Group room created',
      data: room
    });

  } catch (error) {
    next(error);
  }
}
