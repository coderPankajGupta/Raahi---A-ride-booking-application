import { auth } from "@/auth";
import connectDB from "@/lib/connectDB";
import userModel from "@/models/user.model";

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session || !session.user?.email || session.user.role !== "admin") {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const {rejectionReason} = await req.json()
    const partnerId = (await context.params).id;

    const partner = await userModel.findById(partnerId);
    if (!partner || partner.role !== "partner") {
      return Response.json({ message: "Partner not found" }, { status: 404 });
    }

    partner.partnerStatus = "rejected";
    partner.rejectionReason = rejectionReason
    await partner.save();

    return Response.json(
      { message: "Partner Rejected Successfully." },
      { status: 200 },
    );
  } catch (error) {
    return Response.json(
      { message: `Partner Rejected Error ${error}` },
      { status: 500 },
    );
  }
}
