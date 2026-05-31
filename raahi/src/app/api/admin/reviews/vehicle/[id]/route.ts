import { auth } from "@/auth";
import connectDB from "@/lib/connectDB";
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
    const vehicleId = (await context.params).id;

    const vehicle = await vehicleModel.findById(vehicleId).populate("owner");
    if (!vehicle) {
      return Response.json({ message: "Vehicle not found" }, { status: 404 });
    }

    return Response.json(vehicle, { status: 200 });
  } catch (error) {
    return Response.json(
      { message: `Vehicle review get error : ${error}` },
      { status: 500 },
    );
  }
}
