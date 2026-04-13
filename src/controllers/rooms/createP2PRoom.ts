import { NextFunction, Response } from 'express';
import { AuthenticatedRequest } from '../../middleware/requireAuth';
import RoomModel from '../../model/Room';
import UserModel from '../../model/User';

export default async function createP2PRoom(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const {_id:userId, index:userIndex} = req.user.id;
    const { recipientId, recipientIndex} = req.body;

    const recipient = await UserModel.findById(recipientId);
    if(!recipient){
      return res.status(404).json({
        status: 'error',
        message: 'Recipient not found'
      });
    }
    const roomName= userIndex> recipientIndex ? `${userIndex}-${recipientIndex}` : `${recipientIndex}-${userIndex}`;
    
    const existingRoom = await RoomModel.findOne({
      roomType: 'p2p',
      name: roomName
    });

    if (existingRoom) {
      return res.status(400).json({
        status: 'error',
        message: 'P2P room already exists'
      });
    }

    const room = new RoomModel({
      name: roomName,
      members: [userId, recipientId],
      roomType: 'p2p'
    });

    await room.save();
    await room.populate('members', 'firstName lastName formattedText _id');

    res.status(201).json({
      status: 'success',
      message: 'P2P room created',
      data: room
    });

  } catch (error) {
    next(error);
  }
}
