import mongoose from 'mongoose';
import RoomModel from '../model/Room';
import UserModel from '../model/User';
import MessageModel from '../model/Message';
import SocketService from './socketService';

export interface InitiateConversationParams {
  userId: string;
  recipientId: string;
  initialMessage?: string;
}

export interface SendMessageParams {
  roomId: string;
  senderId: string;
  content: string;
}

export class RoomService {
  private socketService: SocketService;

  constructor(socketService: SocketService) {
    this.socketService = socketService;
  }

  /**
   * Initiates a conversation between two users
   * Creates a P2P room and inserts initial message if provided
   */
  async initiateConversation(params: InitiateConversationParams) {
    const { userId, recipientId, initialMessage } = params;

    // Validate recipient exists
    const recipient = await UserModel.findById(recipientId);
    if (!recipient) {
      throw new Error('Recipient not found');
    }

    // Get user indices for room naming
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const userIndex = user.index || 0;
    const recipientIndex = recipient.index || 0;

    // Generate room name based on indices
    const roomName = userIndex > recipientIndex 
      ? `${userIndex}-${recipientIndex}` 
      : `${recipientIndex}-${userIndex}`;

    // Check if room already exists
    const existingRoom = await RoomModel.findOne({
      roomType: 'p2p',
      name: roomName
    });

    if (existingRoom) {
      // If room exists and initial message provided, send it
      if (initialMessage) {
        return this.sendMessage({
          roomId: existingRoom._id.toString(),
          senderId: userId,
          content: initialMessage
        });
      }
      
      return existingRoom;
    }

    // Create new P2P room
    const room = new RoomModel({
      name: roomName,
      members: [userId, recipientId],
      roomType: 'p2p'
    });

    await room.save();
    await room.populate('members', 'firstName lastName formattedText _id');

    // Insert initial message if provided
    if (initialMessage) {
      const messages = [{
        senderId: new mongoose.Types.ObjectId(userId),
        roomId: room._id,
        content: initialMessage
      }];

      await MessageModel.insertMany(messages);

      // Emit message via socket
      this.socketService.sendMessageToRoom(room._id.toString(), 'new-message', {
        messageId: messages[0]._id,
        roomId: room._id,
        senderId: userId,
        content: initialMessage,
        createdAt: new Date()
      });
    }

    // Emit room creation event
    this.socketService.sendMessageToUser(recipientId, 'room-created', {
      room: room,
      initiatorId: userId
    });

    return room;
  }

  /**
   * Sends a message to a room
   * Creates conversation entries for both persons using insertMany
   */
  async sendMessage(params: SendMessageParams) {
    const { roomId, senderId, content } = params;

    // Validate room exists
    const room = await RoomModel.findById(roomId);
    if (!room) {
      throw new Error('Room not found');
    }

    // Validate sender is a member of the room
    if (!room.members.includes(new mongoose.Types.ObjectId(senderId))) {
      throw new Error('Sender is not a member of this room');
    }

    // Create message
    const message = {
      senderId: new mongoose.Types.ObjectId(senderId),
      roomId: new mongoose.Types.ObjectId(roomId),
      content: content
    };

    // Insert message using insertMany
    const savedMessages = await MessageModel.insertMany([message]);
    const savedMessage = savedMessages[0];

    // Populate message with sender info
    await savedMessage.populate('senderId', 'firstName lastName formattedText _id');

    // Emit message to room members
    this.socketService.sendMessageToRoom(roomId, 'new-message', {
      messageId: savedMessage._id,
      roomId: roomId,
      senderId: senderId,
      content: content,
      sender: savedMessage.senderId,
      createdAt: savedMessage.createdAt
    });

    // For P2P rooms, also create conversation entries for both users
    if (room.roomType === 'p2p') {
      const recipientId = room.members.find(
        member => member.toString() !== senderId
      );

      if (recipientId) {
        // You could extend this to create Conversation model entries here
        // For now, the message serves as the conversation record
        console.log(`Message sent from ${senderId} to ${recipientId} in room ${roomId}`);
      }
    }

    return savedMessage;
  }

  /**
   * Gets messages for a room with pagination
   */
  async getRoomMessages(roomId: string, page: number = 1, limit: number = 50) {
    const skip = (page - 1) * limit;

    const messages = await MessageModel.find({ roomId })
      .populate('senderId', 'firstName lastName formattedText _id')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return messages.reverse(); // Return in chronological order
  }

  /**
   * Gets all rooms for a user
   */
  async getUserRooms(userId: string) {
    const rooms = await RoomModel.find({ members: userId })
      .populate('members', 'firstName lastName formattedText _id')
      .sort({ updatedAt: -1 });

    return rooms;
  }

  /**
   * Marks messages as read (if you implement read status)
   */
  async markMessagesAsRead(roomId: string, userId: string) {
    // This could be extended to track read receipts
    // For now, just emit a read event
    this.socketService.sendMessageToRoom(roomId, 'messages-read', {
      userId: userId,
      roomId: roomId,
      readAt: new Date()
    });
  }
}

export default RoomService;
