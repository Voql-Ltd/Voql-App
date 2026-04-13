import { NextFunction, Response } from 'express';
import { AuthenticatedRequest } from '../../middleware/requireAuth';
import FriendModel from '../../model/Friend';

export const getMyFriends = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.id;

    const friends = await FriendModel.find({
      $or: [
        { requester: userId, status: 'accepted' },
        { recipient: userId, status: 'accepted' }
      ],
      status:'accepted'
    })
    .populate('requester recipient')
    .sort({ createdAt: -1 }); 

    // const friendUsers = friends.reduce((users: any[], friendship) => {
    //   const friendId = friendship.requester?._id.toString() === userId 
    //     ? friendship.recipient._id 
    //     : friendship.requester._id;
      
    //   if (!users.find(user => user._id.toString() === friendId)) {
    //     users.push(friendship.requester || friendship.recipient);
    //   }
      
    //   return users;
    // }, []);

    res.status(200).json({ 
      data: friends,
      status:'success',
      message:"Friends gotten successfully"
    });

  } catch (error) {
    console.error('Error getting friends:', error);
    next(error);
  }
};
