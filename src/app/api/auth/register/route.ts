import connectDB from "@/lib/connectDB";
import { sendMail } from "@/lib/sendMail";
import userModel from "@/models/user.model";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();
    await connectDB();

    let user = await userModel.findOne({ email });
    if (user && user.isEmailVerified) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 },
      );
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes

    if (password.length < 6) {
      return NextResponse.json(
        { message: "Password must be greater than 6 characters." },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    if (user && !user.isEmailVerified) {
      user.name = name;
      user.password = hashedPassword;
      user.email = email;
      user.otp = otp;
      user.otpExpiresAt = otpExpiresAt;
      await user.save();  
    } else {
      user = await userModel.create({
        name,
        email,
        password: hashedPassword,
        otp,
        otpExpiresAt,
      });
    }

    await sendMail(
      email,
      "Verify your email for RAAHI",
      `<p>Your OTP for email verification is <b>${otp}</b>. It will expire in 10 minutes.</p>`,
    );

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: `Unable to create account : ${error}` },
      { status: 500 },
    );
  }
}
