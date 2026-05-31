import { auth } from "@/auth";
import connectDB from "@/lib/connectDB";
import userModel from "@/models/user.model";
import vehicleModel from "@/models/vehicle.model";

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session || !session.user?.email || session.user.role !== "admin") {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { reason } = await req.json();
    await connectDB();
    const vehicleId = (await context.params).id;

    const vehicle = await vehicleModel.findById(vehicleId);
    if (!vehicle) {
      return Response.json({ message: "Vehicle not found" }, { status: 404 });
    }

    vehicle.status = "rejected";
    vehicle.rejectionReason = reason;
    await vehicle.save();

    return Response.json(vehicle, { status: 200 });
  } catch (error) {
    return Response.json(
      { message: `Vehicle rejected error : ${error}` },
      { status: 500 },
    );
  }
}
