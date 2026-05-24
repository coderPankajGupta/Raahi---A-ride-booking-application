import { auth } from "@/auth";
import connectDB from "@/lib/connectDB";
import partnerBankModel from "@/models/partnerBank.model";
import partnerDocsModel from "@/models/partnerDocs.model";
import userModel from "@/models/user.model";

export async function GET(
  req: Request,
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

    if (partner.partnerStatus === "approved") {
      return Response.json(
        { message: "Partner already approved." },
        { status: 400 },
      );
    }

    const partnerDocs = await partnerDocsModel.findOne({ owner: partner._id });
    const partnerBank = await partnerBankModel.findOne({ owner: partner._id });

    if (!partnerBank || !partnerDocs) {
      return Response.json(
        { message: "Partner did not completed on boarding steps" },
        { status: 400 },
      );
    }

    partner.partnerStatus = "approved";
    partner.partnerOnBoardingSteps = 4;
    await partner.save();
    partnerDocs.status = "approved";
    await partnerDocs.save();
    partnerBank.status = "verified";
    await partnerBank.save();

    return Response.json(
      { message: "Partner Approved Successfully." },
      { status: 200 },
    );
  } catch (error) {
    return Response.json(
      { message: `Partner Approved Error ${error}` },
      { status: 500 },
    );
  }
}
