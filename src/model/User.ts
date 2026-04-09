import mongoose, { Document, Schema } from "mongoose";

const SoundSchema = new Schema({
  firstVoice: {
    type: String,
    required: false,
  },
  lastVoice: {
    type: String,
    required: false,
  },
  nickVoice: {
    type: String,
    required: false,
  },

}, { _id: false });

export interface IUser extends Document {
  firstName: string;
  lastName: string;

  nickName?: string;
  phone: string;
  countryCode?: string;
  countryName?: string;
  formattedText?:string;
  imageUrl?: string;
  status: "active" | "suspended" | "deleted" | "pending" | "rejected";
  sound: {
    firstVoice?: string;
    lastVoice?: string;
    nickVoice?: string;
  };
  deviceInfo?: Array<Record<string, any>>;
  createdAt?: Date;
  updatedAt?: Date;
}

const UserSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    nickName: {
      type: String,
      required: false,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    countryCode: {
      type: String,
      required: true,
    },
    countryName: {
      type: String,
      required: true,
    },
    formattedText: {
      type: String,
      required: true,
      unique: true,
    },
    imageUrl: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      enum: ["active", "suspended", "deleted", "pending", "rejected"],
      default: "active",
    },
    sound: {
      type: SoundSchema,
      required: false,
    },
    deviceInfo: {
      type: [Schema.Types.Mixed],
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.model<IUser>("User", UserSchema);

export default UserModel;
