import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IUserConversation extends Document {
  user: Types.ObjectId;
  lastMessage: Types.ObjectId | null;
  room:Types.ObjectId
  unreadCount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const UserConversationSchema = new Schema<IUserConversation>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    lastMessage: {
      type: Schema.Types.ObjectId,
      ref: 'Message',
      default: null,
    },
    room: {
      type: Schema.Types.ObjectId,
      ref: 'Room',
      default: null,
    },
    
    unreadCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
UserConversationSchema.index({ user: 1 });
UserConversationSchema.index({ user: 1, updatedAt: -1 });

const UserConversationModel = mongoose.model<IUserConversation>("UserConversation", UserConversationSchema);

export default UserConversationModel;
