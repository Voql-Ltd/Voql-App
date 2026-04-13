import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IFriend extends Document {
  requester: Types.ObjectId;
  recipient: Types.ObjectId;
  status: 'pending' | 'accepted' | 'blocked';
  createdAt: Date;
  updatedAt: Date;
}

const FriendSchema = new Schema<IFriend>({
  requester: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipient: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'blocked','rejected'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Prevent duplicate relationships between same users
FriendSchema.index({ requester: 1, recipient: 1 }, { unique: true });
FriendSchema.pre('find', function() {
  this.populate('requester', 'firstName lastName gender email formattedText _id');
  this.populate('recipient', 'firstName lastName gender email formattedText _id');
})  
FriendSchema.pre('findOne', function() {
  this.populate('requester', 'firstName lastName gender email formattedText _id');
  this.populate('recipient', 'firstName lastName gender email formattedText _id');
})  
// Ensure requester != recipient
// friendSchema.pre('save', function(next) {
//   if (this.requester.toString() === this.recipient.toString()) {
//     const error = new Error('Cannot send friend request to yourself');
//     return next(error);
//   }
//   next();
// });


const FriendModel = mongoose.model<IFriend>("Friend", FriendSchema);


export default FriendModel;