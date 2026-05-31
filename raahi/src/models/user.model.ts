import mongoose, { Document } from "mongoose";
import { FaBullseye } from "react-icons/fa";

type VideoKycStatus =
  | "not_required"
  | "pending"
  | "in_progress"
  | "approved"
  | "rejected";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: "user" | "partner" | "admin";
  isEmailVerified?: boolean;
  otp?: string;
  otpExpiresAt?: Date;
  partnerOnBoardingSteps: number;
  mobileNumber?: string;
  partnerStatus: "pending" | "approved" | "rejected";
  rejectionReason?: string;
  videoKycStatus: VideoKycStatus;
  videoKycRoomId: string;
  videoKycRejectionReason: string;
  socketId: string | null;
  location?: {
    type: "Point";
    coordinates: [number, number];
  };
  isOnline: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    role: {
      type: String,
      default: "user",
      enum: ["user", "partner", "admin"],
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    partnerStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    rejectionReason: {
      type: String,
    },
    videoKycStatus: {
      type: String,
      enum: ["not_required", "pending", "in_progress", "approved", "rejected"],
      default: "not_required",
    },
    videoKycRoomId: {
      type: String,
    },
    videoKycRejectionReason: {
      type: String,
    },
    otp: {
      type: String,
    },
    otpExpiresAt: {
      type: Date,
    },
    partnerOnBoardingSteps: {
      type: Number,
      min: 0,
      max: 8,
      default: 0,
    },
    mobileNumber: {
      type: String,
    },
    socketId: {
      type: String,
      default: null,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: [Number],
    },
    isOnline: {
      type: Boolean,
      default: false,
      index: true,
    },
  },

  { timestamps: true },
);

userSchema.index({ location: "2dsphere" });

const userModel = mongoose.models.User || mongoose.model("User", userSchema);
export default userModel;
