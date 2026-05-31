import { auth } from "@/auth";
import connectDB from "@/lib/connectDB";
import userModel from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  res: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session || !session.user?.email || session.user.role !== "admin") {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const partnerId = (await context.params).id;

    const partner = await userModel.findById(partnerId);
    if (!partner || partner.role !== "partner") {
      return Response.json({ message: "Partner not found" }, { status: 404 });
    }

    const roomId = `kyc-${partner._id}-${Date.now()}`
    partner.videoKycRoomId = roomId
    partner.videoKycStatus = "in_progress"
    partner.partnerOnBoardingSteps = 4

    await partner.save()

    return NextResponse.json(roomId,{status:200})
  } catch (error) {
    return NextResponse.json({message:`Video kyc start error : ${error}`},{status:500})
  }
}
