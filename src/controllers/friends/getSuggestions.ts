import { NextFunction, Response } from 'express';
import FriendModel from '../../model/Friend';
import { AuthenticatedRequest } from '../../middleware/requireAuth';
import UserModel from '../../model/User';
  
export const getPeopleYouMayKnow = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.id;
    const { phoneNumbers } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'User authentication required' });
    }
    let suggestions: any[] = [];

    // Get my accepted friends. you dont need to be accepted if you are the request of the friend
    const mySomewhatFriends = await FriendModel.find({
      $or: [
        { requester: userId},
        { recipient: userId, status: 'accepted' }
      ]
    })
    .populate('requester recipient');

    if(mySomewhatFriends.length>0) {

      //get my friend ids excluding me
      const mySomeWhatFriendIds = mySomewhatFriends.map(f => {
        return f.requester.toString() === userId
          ? f.recipient.toString()
          : f.requester.toString();
      });

      //get friends of friends that are requesters
      const friendsOfFriends = await FriendModel.find({
        requester: { $in: mySomeWhatFriendIds },
        status: 'accepted'
      })
      .populate('requester recipient');

      //count mutual friends
      const mutualFriendCounts = friendsOfFriends.reduce((counts: Record<string, number>, friendship) => {
        const friendId = friendship.requester?._id.toString() === userId 
          ? friendship.recipient._id.toString() 
          : friendship.requester._id.toString();
        
        counts[friendId] = (counts[friendId] || 0) + 1;
        return counts;
      }, {});
      // A. Mutual friends
      Object.entries(mutualFriendCounts).forEach(([friendId, count]) => {
        if (count >= 2) {
          const user = friendsOfFriends.find(f => 
            (f.requester?._id.toString() === friendId || f.recipient?._id.toString() === friendId)
          );
          
          if (user) {
            suggestions.push({
              user,
              reason: count+' mutual friends'
            });
          }
        }
      });

    }
    

    // B. Contact-based suggestions (if phone numbers provided)
    if (phoneNumbers) {
      
      const matchedUsers = await UserModel.find({
        phone: { $in: phoneNumbers }
      })

      matchedUsers.forEach(user => {
        if (!suggestions.find(s => s.user.id === user._id)) {
          suggestions.push({
            user,
            reason: 'In your contacts'
          });
        }
      });
    }

    // Remove duplicates and limit to 20 suggestions
    const uniqueSuggestions = suggestions
      .filter((suggestion, index, arr) => 
        arr.findIndex(s => s.user.id === suggestion.user.id) === index
      )
      .slice(0, 20);

    return res.status(200).json({ data:{suggestions: uniqueSuggestions }, status:'success', message:'Suggestions retrieved successfully' });

  } catch (error) {
    console.error('Error getting suggestions:', error);
    next(error)
  }
};
