import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IRoom extends Document {
  name: string;
  members: Types.ObjectId[];
  roomType: 'p2p' | 'group' | 'broadcast';
  createdAt: Date;
  updatedAt: Date;
}

const RoomSchema = new Schema<IRoom>({
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
RoomSchema.index({ name: 1 }, { unique: true });
RoomSchema.index({ members: 1 });

const RoomModel = mongoose.model<IRoom>("Room", RoomSchema);

export default RoomModel;
