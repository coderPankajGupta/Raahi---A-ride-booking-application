import connectDB from "@/lib/connectDB";
import userModel from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json(
        { message: "Email and OTP are required." },
        { status: 400 },
      );
    }

    let user = await userModel.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { message: "No user found with the provided email." },
        { status: 404 },
      );
    }

    if (user.isEmailVerified) {
      return NextResponse.json(
        { message: "Email is already verified." },
        { status: 400 },
      );
    }

    if(user.otpExpiresAt && user.otpExpiresAt < new Date()) {
        return NextResponse.json(
            { message: "OTP has expired. Please request a new one." },
            { status: 400 },
        );
    }

    if (!user.otp || user.otp !== otp) {
      return NextResponse.json(
        { message: "Invalid OTP." },
        { status: 400 },
      );
    } 

    user.isEmailVerified = true;
    user.otp = undefined;
    user.otpExpiresAt = undefined;
    await user.save();

    return NextResponse.json(
      { message: "Email verified successfully." },
      { status: 200 },
    );

  } catch (error) {
    return NextResponse.json(
      { message: `Unable to verify email : ${error}` },
      { status: 500 },
    );
  }
}
