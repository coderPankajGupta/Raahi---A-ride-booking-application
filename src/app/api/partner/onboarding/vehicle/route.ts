import { auth } from "@/auth";
import connectDB from "@/lib/connectDB";
import userModel from "@/models/user.model";
import Vehicle from "@/models/vehicle.model";

const VEHICLE_REGEX = /^[A-Z]{2}[0-9]{1,2}[A-Z]{0,2}[0-9]{4}$/;

export async function POST(req: Request) {
  try {
    await connectDB();
    const session = await auth();
    if (!session || !session.user?.email) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await userModel.findOne({ email: session.user.email });
    if (!user) {
      return Response.json({ message: "User not found" }, { status: 401 });
    }

    const { type, number, vehicleModel } = await req.json();
    if (!type || !number || !vehicleModel) {
      return Response.json(
        { message: "All fields are required" },
        { status: 400 },
      );
    }

    if (!VEHICLE_REGEX.test(number)) {
      return Response.json(
        { message: "Invalid vehicle number" },
        { status: 400 },
      );
    }

    const vehicleNumber = number.toUpperCase();

    let vehicle = await Vehicle.findOne({ owner: session.user.id });

    if (vehicle) {
      vehicle.type = type;
      vehicle.number = vehicleNumber;
      vehicle.vehicleModel = vehicleModel;
      vehicle.status = "pending";
      await vehicle.save();

      return Response.json(vehicle, { status: 200 });
    }

    const duplicateVehicle = await Vehicle.findOne({
      number: number.toUpperCase(),
    });

    if (duplicateVehicle) {
      return Response.json(
        { message: "Vehicle number already exists" },
        { status: 400 },
      );
    }

    vehicle = await Vehicle.create({
      type,
      number: vehicleNumber,
      vehicleModel,
      owner: user._id,
    });

    if (user.partnerOnBoardingSteps < 1) {
      user.partnerOnBoardingSteps = 1;
    }

    user.role = "partner";
    await user.save();
    return Response.json(vehicle, { status: 201 });
  } catch (error) {
    return Response.json(
      { message: `Vehicle Error : ${error}` },
      { status: 500 },
    );
  }
}

export async function GET(req: Request) {
  try {
    await connectDB();
    const session = await auth();
    if (!session || !session.user?.email) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await userModel.findOne({ email: session.user.email });
    if (!user) {
      return Response.json({ message: "User not found" }, { status: 401 });
    }

    const vehicle = await Vehicle.findOne({ owner: user._id });
    if (vehicle) {
      return Response.json(vehicle, { status: 200 });
    } else {
      return Response.json(
        { message: "Vehicle details not found" },
        { status: 404 },
      );
    }
  } catch (error) {
    return Response.json(
      { message: `Get Vehicle Error : ${error}` },
      { status: 500 },
    );
  }
}
