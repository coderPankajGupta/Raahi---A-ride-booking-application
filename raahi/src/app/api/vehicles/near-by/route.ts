import connectDB from "@/lib/connectDB";
import userModel from "@/models/user.model";
import vehicleModel from "@/models/vehicle.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { latitude, longitude, vehicleType } = await req.json();
    if (!latitude || !longitude) {
      return NextResponse.json(
        { message: "Co-ordinates not found." },
        { status: 400 },
      );
    }

    const partners = await userModel.find({
      role: "partner",
      isOnline: true,
      partnerStatus: "approved",
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [longitude, latitude],
          },
          $maxDistance: 10000,
        },
      },
    });

    const partnerIds = partners.map((p) => p._id);

    if (partnerIds.length == 0) {
      return NextResponse.json(
        { message: "Vehicles not found." },
        { status: 200 },
      );
    }

    const vehicles = await vehicleModel
      .find({
        owner: { $in: partnerIds },
        type: vehicleType,
        status: "approved",
        isActive: true,
      })
      .lean();

    return NextResponse.json(vehicles, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: `Near by vehicles error : ${error}` },
      { status: 500 },
    );
  }
}
