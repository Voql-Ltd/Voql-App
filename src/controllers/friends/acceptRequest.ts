import { NextFunction, Response } from 'express';
import { AuthenticatedRequest } from '../../middleware/requireAuth';
import FriendModel from '../../model/Friend';

export const acceptFriendRequest = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { requestId } = req.body;
    const userId = req.user.id;

    if (!requestId) {
      return res.status(400).json({ error: 'Request ID is required' });
    }

    const friendRequest = await FriendModel.findById(requestId);
    if (!friendRequest) {
      return res.status(404).json({ error: 'Friend request not found' });
    }

    if (friendRequest.recipient.toString() !== userId) {
      return res.status(403).json({ error: 'Only the recipient can accept the friend request' });
    }

    friendRequest.status = 'accepted';
    await friendRequest.save();

    res.status(200).json({ 
      message: 'Friend request accepted successfully',
      friendship: {
        id: friendRequest._id,
        requester: friendRequest.requester,
        recipient: friendRequest.recipient,
        status: 'accepted'
      }
    });

  } catch (error) {
    console.error('Error accepting friend request:', error);
    next(error);
  }
};
