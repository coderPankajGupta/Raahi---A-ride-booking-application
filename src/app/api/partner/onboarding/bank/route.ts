import { auth } from "@/auth";
import connectDB from "@/lib/connectDB";
import partnerBankModel from "@/models/partnerBank.model";
import userModel from "@/models/user.model";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const session = await auth();
    if (!session || !session.user?.email) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await userModel.findOne({ email: session.user.email });
    if (!user) {
      return Response.json({ message: "User not found" }, { status: 401 });
    }

    const { accountHolder, accountNumber, upi, ifsc, mobileNumber } =
      await req.json();
    if (!accountHolder || !accountNumber || !mobileNumber || !ifsc) {
      return Response.json(
        {
          message:
            "Account holder name, mobile number, account number and IFSC code are required",
        },
        { status: 400 },
      );
    }

    const partnerBank = await partnerBankModel.findOneAndUpdate(
      { owner: user._id },
      {
        accountHolder,
        accountNumber,
        ifsc,
        upi,
        status: "added",
      },
      { upsert: true, new: true },
    );

    user.mobileNumber = mobileNumber;
    if (user.partnerOnBoardingSteps < 3) {
      user.partnerOnBoardingSteps = 3;
    }

    await user.save();

    return Response.json(partnerBank, { status: 200 });
  } catch (error) {
    return Response.json(
      { message: `Bank Details Upload Error : ${error}` },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const session = await auth();
    if (!session || !session.user?.email) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await userModel.findOne({ email: session.user.email });
    if (!user) {
      return Response.json({ message: "User not found" }, { status: 401 });
    }

    const partnerBank = await partnerBankModel.findOne({ owner: user._id });
    if (partnerBank) {
      return Response.json({partnerBank, mobileNumber:user.mobileNumber}, { status: 200 });
    } else {
      return Response.json({ message: "Bank details not found" }, { status: 404 })
    }
  } catch (error) { 
    return Response.json(
      { message: `Get Bank Details Error : ${error}` },
      { status: 500 },
    );
  }
}
