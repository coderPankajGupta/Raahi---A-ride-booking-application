import { auth } from "@/auth";
import connectDB from "@/lib/connectDB";
import userModel from "@/models/user.model";

export async function GET() {
  try {
    await connectDB();
    const session = await auth();
    if (!session || !session.user?.email) {
      return Response.json({ message: "Unauthorized" }, { status: 400 });
    }

    const partner = await userModel.findOne({ email: session.user.email });
    if (!partner) {
      return Response.json({ message: "User not found" }, { status: 400 });
    }

    if (partner.videoKycStatus !== "rejected") {
      return Response.json(
        { message: "You can not send kyc request at this time." },
        { status: 400 },
      );
    }

    partner.videoKycStatus = "pending";
    partner.videoKycRejectionReason = undefined;
    partner.videoKycRoomId = undefined;

    await partner.save();

    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    return Response.json(
      { message: `Kyc request error ${error}` },
      { status: 500 },
    );
  }
}
