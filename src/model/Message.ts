import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IMessage extends Document {
  senderId: Types.ObjectId;
  roomId: Types.ObjectId;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>({
  senderId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  roomId: {
    type: Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true
});


const MessageModel = mongoose.model<IMessage>("Message", MessageSchema);

export default MessageModel;
