import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IConversation extends Document {
  name: string;
  members: Types.ObjectId[];
  roomType: 'p2p' | 'group' | 'broadcast';
  createdAt: Date;
  updatedAt: Date;
}

const ConversationSchema = new Schema<IConversation>({
  name: {
    type: String,
    required: true,
    unique: true
  },
  members: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  roomType: {
    type: String,
    enum: ['p2p', 'group', 'broadcast'],
    required: true
  }
}, {
  timestamps: true
});

// Index for efficient room lookups
ConversationSchema.index({ name: 1 }, { unique: true });
ConversationSchema.index({ members: 1 });

const ConversationModel = mongoose.model<IConversation>("Conversation", ConversationSchema);

export default ConversationModel;
