import { auth } from "@/auth";
import connectDB from "@/lib/connectDB";
import partnerBankModel from "@/models/partnerBank.model";
import partnerDocsModel from "@/models/partnerDocs.model";
import userModel from "@/models/user.model";
import vehicleModel from "@/models/vehicle.model";

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

    const vehicle = await vehicleModel.findOne({ owner: partner._id });
    const documents = await partnerDocsModel.findOne({
      owner: partner._id,
    });
    const bank = await partnerBankModel.findOne({ owner: partner._id });

    return Response.json(
      {
        vehicle: vehicle || null,
        documents: documents || null,
        bank: bank || null,
      },
      { status: 200 },
    );
  } catch (error) {
    return Response.json({ message: `Partner get error ${error}` }, { status: 500 });
  }
}
