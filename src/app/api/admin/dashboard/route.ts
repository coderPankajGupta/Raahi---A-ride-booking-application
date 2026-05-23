import { auth } from "@/auth";
import connectDB from "@/lib/connectDB";
import userModel from "@/models/user.model";
import vehicleModel from "@/models/vehicle.model";

export async function GET(req: Request) {
  try {
    await connectDB();
    const session = await auth();
    if (!session || !session.user?.email || session.user.role !== "admin") {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const totalPartners = await userModel.countDocuments({ role: "partner" });
    const totalApprovedPartners = await userModel.countDocuments({
      role: "partner",
      partnerStatus: "approved",
    });
    const totalPendingPartners = await userModel.countDocuments({
      role: "partner",
      partnerStatus: "pending",
    });
    const totalRejectedPartners = await userModel.countDocuments({
      role: "partner",
      partnerStatus: "rejected",
    });

    const pendingPartnerUsers = await userModel.find({
      role: "partner",
      partnerStatus: "pending",
      partnerOnBoardingSteps: 3,
    });

    const partnerIds = pendingPartnerUsers.map((p) => p._id);
    const partnerVehicles = await vehicleModel.find({
      owner: { $in: partnerIds },
    });

    const vehicleTypeMap = new Map(
      partnerVehicles.map((v) => [v.owner.toString(), v.type]),
    );

    const pendingPartnersReviews = pendingPartnerUsers.map((partner) => ({
      _id: partner._id,
      name: partner.name,
      email: partner.email,
      vehicleType: vehicleTypeMap.get(partner._id.toString()),
    }));

    return Response.json(
      {
        stats: {
          totalPartners,
          totalApprovedPartners,
          totalPendingPartners,
          totalRejectedPartners,
        },
        pendingPartnersReviews,
      },
      { status: 200 },
    );
  } catch (error) {
    return Response.json(
      { message: `Unable to fetch dashboard data : ${error}` },
      { status: 500 },
    );
  }
}
