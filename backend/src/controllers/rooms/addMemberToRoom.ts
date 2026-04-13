import { NextFunction, Response } from 'express';
import { AuthenticatedRequest } from '../../middleware/requireAuth';
import RoomModel from '../../model/Room';
import UserModel from '../../model/User';

export default async function addMemberToRoom(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { roomId, userId } = req.body;

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    const room = await RoomModel.findByIdAndUpdate(
      roomId,
      { $addToSet: { members: userId } },
      { new: true }
    )
    
    if (!room) {
      return res.status(404).json({
        status: 'error',
        message: 'Room not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Member added',
      data: room
    });

  } catch (error) {
    next(error);
  }
}
