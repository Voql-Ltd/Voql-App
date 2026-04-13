import { Server as HTTPServer } from 'http';
import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';
import { Socket, Server as SocketIOServer } from 'socket.io';
import config from '../configs/constants';
import MessageModel from '../model/Message';
import RoomModel from '../model/Room';
import UserConversationModel from '../model/Conversation';

interface AuthenticatedSocket extends Socket {
  userId: string;
}

export class SocketService {
  private io: SocketIOServer;
  private connectedUsers: Map<string, string> = new Map(); // userId -> socketId

  constructor(server: HTTPServer) {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    });

    this.setupMiddleware();
    this.setupEventHandlers();
  }

  private setupMiddleware() {
    this.io.use(async (socket: any, next) => {
      try {
        const token = socket.handshake.auth.token;
        if (!token) {
          return next(new Error('Authentication token required'));
        }

        const decoded = jwt.verify(token, config.APP_SECRET_KEY) as any;

        socket.userId = decoded.id;
        next();
      } catch (error) {
        next(new Error('Invalid authentication token'));
      }
    });
  }

  private setupEventHandlers() {
    this.io.on('connection', (socket: Socket) => {
      const authenticatedSocket = socket as AuthenticatedSocket;
      console.log(`User ${authenticatedSocket.userId} connected`);
      
      // Store user connection
      this.connectedUsers.set(authenticatedSocket.userId, socket.id);

      // Join user to their rooms
      this.joinUserToRooms(authenticatedSocket);

      // Handle disconnection
      socket.on('disconnect', () => {
        console.log(`User ${authenticatedSocket.userId} disconnected`);
        this.connectedUsers.delete(authenticatedSocket.userId);
      });

      // Handle joining a specific room
      socket.on('join-room', (roomId: string) => {
        socket.join(roomId);
        console.log(`User ${authenticatedSocket.userId} joined room ${roomId}`);
      });

      // Handle leaving a room
      // socket.on('leave-room', (roomId: string) => {
      //   socket.leave(roomId);
      //   console.log(`User ${authenticatedSocket.userId} left room ${roomId}`);
      // });

      // socket.on('typing', (data: { roomId: string }) => {
      //   socket.to(data.roomId).emit('user-typing', {
      //     userId: authenticatedSocket.userId,
      //     roomId: data.roomId
      //   });
      // });

      // socket.on('stop-typing', (data: { roomId: string }) => {
      //   socket.to(data.roomId).emit('user-stop-typing', {
      //     userId: authenticatedSocket.userId,
      //     roomId: data.roomId
      //   });
      // });
    });
  }

  private async joinUserToRooms(socket: AuthenticatedSocket) {
    try {
      const rooms = await RoomModel.find({ members: socket.userId });
      rooms.forEach(room => {
        socket.join(room._id.toString());
      });
    } catch (error) {
      console.error('Error joining user to rooms:', error);
    }
  }

  async sendMessageToRoom(
    {isFirstMessage, message, sender, roomId, room_members}:
    {isFirstMessage: boolean, message: string, sender: string, roomId: string, room_members:string[]}) {
    try {
      const newMessage = new MessageModel({
        senderId: sender,
        roomId: roomId,
        content: message
      });
      
      const savedMessage = await newMessage.save();
      //i do not think if new message is needed 
      if (1) {
        const bulkOperations = room_members.map((memberId) => ({
          updateOne: {
            filter: { user: new Types.ObjectId(memberId), room: new Types.ObjectId(roomId) },
            update: {
              $set: {
                user: new Types.ObjectId(memberId),
                room: new Types.ObjectId(roomId),
                lastMessage: savedMessage._id,
                unreadCount: memberId.toString() !== sender ? 1 : 0
              }
            },
            upsert: true
          }
        }));
        
        try {
          await UserConversationModel.bulkWrite(bulkOperations);
        } catch (error) {
          console.log('error in creating conversations in bulk', error);
        }
      } else {
        await UserConversationModel.updateMany(
          { room: new Types.ObjectId(roomId) },
          {
            lastMessage: savedMessage._id,
            $inc: { unreadCount: 1 }
          }
        );
        
        await UserConversationModel.updateOne(
          { room: new Types.ObjectId(roomId), user: new Types.ObjectId(sender) },
          { unreadCount: 0 }
        );
      }
      
      this.io.to(roomId).emit('new-message', {
        _id: savedMessage._id,
        senderId: sender,
        roomId: roomId,
        content: message,
        createdAt: savedMessage.createdAt
      });
      
    } catch (error) {
      console.error('Error sending message to room:', error);
    }
  }

  // Send message to specific user
  sendMessageToUser(userId: string, event: string, data: any) {
    const socketId = this.connectedUsers.get(userId);
    if (socketId) {
      this.io.to(socketId).emit(event, data);
    }
  }
  async initiateConversation(message: string, sender: string, recipient: string) {
    try {
      // Create a P2P room for the two members
      const roomName = `${sender}_${recipient}`;
      const newRoom = new RoomModel({
        name: roomName,
        members: [sender, recipient],
        roomType: 'p2p'
      });
      
      const savedRoom = await newRoom.save();
      
      const newMessage = new MessageModel({
        senderId: sender,
        roomId: savedRoom._id,
        content: message
      });
      
      const savedMessage = await newMessage.save();
      
      // Create conversation for both members
      const conversationPromises = [
        UserConversationModel.findOneAndUpdate(
          { user: sender, room: savedRoom._id },
          {
            user: sender,
            room: savedRoom._id,
            lastMessage: savedMessage._id,
            unreadCount: 0
          },
          { upsert: true, new: true }
        ),
        UserConversationModel.findOneAndUpdate(
          { user: recipient, room: savedRoom._id },
          {
            user: recipient,
            room: savedRoom._id,
            lastMessage: savedMessage._id,
            unreadCount: 1
          },
          { upsert: true, new: true }
        )
      ];
      
      await Promise.all(conversationPromises);
      
      // Make both users join the room
      const senderSocketId = this.connectedUsers.get(sender);
      const recipientSocketId = this.connectedUsers.get(recipient);
      
      if (senderSocketId) {
        this.io.to(senderSocketId).socketsJoin(savedRoom._id.toString());
      }
      
      if (recipientSocketId) {
        this.io.to(recipientSocketId).socketsJoin(savedRoom._id.toString());
      }
      
      // Emit message to room
      this.io.to(savedRoom._id.toString()).emit('new-message', {
        _id: savedMessage._id,
        senderId: sender,
        roomId: savedRoom._id,
        content: message,
        createdAt: savedMessage.createdAt
      });
      
      // Notify recipient about new conversation
      if (recipientSocketId) {
        this.io.to(recipientSocketId).emit('new-conversation', {
          roomId: savedRoom._id,
          message: savedMessage
        });
      }
      
    } catch (error) {
      console.error('Error initiating conversation:', error);
    }
  }

  // Get connected users count
  getConnectedUsersCount(): number {
    return this.connectedUsers.size;
  }

  // Check if user is online
  isUserOnline(userId: string): boolean {
    return this.connectedUsers.has(userId);
  }
}

export default SocketService;
