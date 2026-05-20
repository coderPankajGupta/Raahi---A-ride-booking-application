import mongoose from "mongoose";

interface IPartnerBank {
  owner: mongoose.Types.ObjectId;
  accountHolder: string;
  accountNumber: string;
  ifsc: string;
  upi?: string;
  status: "verified" | "not_added" | "added";
  createdAt: Date;
  updatedAt: Date;
}

const partnerBankSchema = new mongoose.Schema<IPartnerBank>(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    accountHolder: {
      type: String,
      required: true,
    },
    accountNumber: {
      type: String,
      required: true,
      unique: true,
    },
    ifsc: {
      type: String,
      required: true,
      uppercase: true,
    },
    upi: String,
    status: {
      type: String,
      enum: ["verified", "not_added", "added"],
      default: "not_added",
    },
  },
  { timestamps: true },
);

export default mongoose.models.PartnerBank ||
  mongoose.model("PartnerBank", partnerBankSchema);
