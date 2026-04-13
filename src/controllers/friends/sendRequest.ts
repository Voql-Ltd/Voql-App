import { NextFunction, Response } from 'express';
import { AuthenticatedRequest } from '../../middleware/requireAuth';
import FriendModel from '../../model/Friend';

export const sendFriendRequest = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { recipientId } = req.body;
    const requesterId = req.user._id;

    const existingFriendship = await FriendModel.findOne({
      $or: [
        { requester: requesterId, recipient: recipientId },
        { requester: recipientId, recipient: requesterId }
      ]
    });

    if (existingFriendship) {
      return res.status(400).json({ error: 'Friend request already sent or you are already friends' });
    }

    const friendRequest = new FriendModel({
      requester: requesterId,
      recipient: recipientId,
      status: 'pending'
    });

    await friendRequest.save();

    res.status(201).json({ 
      message: 'Friend request sent successfully',
      friendRequest: {
        id: friendRequest._id,
        requester: requesterId,
        recipient: recipientId,
        status: 'pending'
      }
    });

  } catch (error) {
    console.error('Error sending friend request:', error);
    next(error)
    // res.status(500).json({ error: 'Failed to send friend request' });
  }
};
