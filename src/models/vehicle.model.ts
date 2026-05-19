import mongoose, { Document } from "mongoose";

type vehicleType = "bike" | "car" | "loading" | "truck" | "auto";

interface IVehicle extends Document {
  owner: mongoose.Types.ObjectId;
  type: vehicleType;
  vehicleModel: string;
  number: string;
  imageUrl?: string;
  baseFare?: number;
  pricePerKM: number;
  waitingCharge: number;
  status: "approved" | "pending" | "rejected";
  rejectionReason: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const vehicleSchema = new mongoose.Schema<IVehicle>({
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    type:{
        type:String,
        enum:["bike","car","loading","truck","auto"],
        required:true
    },
    number:{
        type:String,
        required:true,
        unique:true
    },

}, { timestamps: true });
