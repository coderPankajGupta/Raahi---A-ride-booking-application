import { auth } from "@/auth";
import uploadOnCloudinary from "@/lib/cloudinary";
import connectDB from "@/lib/connectDB";
import userModel from "@/models/user.model";
import vehicleModel from "@/models/vehicle.model";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const session = await auth();
    if (!session || !session.user?.email) {
      return Response.json({ message: "Unauthorized" }, { status: 400 });
    }

    const partner = await userModel.findOne({ email: session.user.email });
    if (!partner) {
      return Response.json({ message: "Partner not found" }, { status: 400 });
    }

    const vehicle = await vehicleModel.findOne({ owner: partner._id });
    if (!vehicle) {
      return Response.json({ message: "Vehicle not found" }, { status: 400 });
    }

    const formData = await req.formData();
    const image = formData.get("image") as File | null;
    const baseFare = formData.get("baseFare");
    const pricePerKM = formData.get("pricePerKM");
    const waitingCharge = formData.get("waitingCharge");

    let updated = false;

    if (image && image.size > 0) {
      const imageUrl = await uploadOnCloudinary(image);
      vehicle.imageUrl = imageUrl;
      updated = true;
    }

    if (baseFare !== null) {
      vehicle.baseFare = Number(baseFare);
      updated = true;
    }

    if (pricePerKM !== null) {
      vehicle.pricePerKM = Number(pricePerKM);
      updated = true;
    }

    if (waitingCharge !== null) {
      vehicle.waitingCharge = Number(waitingCharge);
      updated = true;
    }

    if (updated === false) {
      return Response.json({ message: "Nothing to update." }, { status: 400 });
    }

    vehicle.status = "pending";
    vehicle.rejectionReason = undefined;
    await vehicle.save();
    partner.partnerOnBoardingSteps = 6;
    await partner.save();

    return Response.json({ message: "Pricing submitted" }, { status: 200 });
  } catch (error) {
    return Response.json(
      { message: `Error during price submition : ${error}` },
      { status: 500 },
    );
  }
}
