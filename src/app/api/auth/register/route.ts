import connectDB from "@/lib/connectDB";
import userModel from "@/models/user.model";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();
    await connectDB();

    let user = await userModel.findOne({ email });
    if (user) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user = await userModel.create({
      name,
      email,
      password: hashedPassword,
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: `Unable to create account : ${error}` },
      { status: 500 },
    );
  }
}
