import { auth } from "@/auth";
import uploadOnCloudinary from "@/lib/cloudinary";
import connectDB from "@/lib/connectDB";
import partnerDocsModel from "@/models/partnerDocs.model";
import userModel from "@/models/user.model";

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

    const formdata = await req.formData();
    const aadhar = formdata.get("aadhar") as Blob | null;
    const license = formdata.get("license") as Blob | null;
    const rc = formdata.get("rc") as Blob | null;
    
    if (!aadhar || !license || !rc) {
      return Response.json(
        { message: "All documents are required" },
        { status: 400 },
      );
    }

    const updatePayload: any = {
      status: "pending",
    };

    if (aadhar) {
      const url = await uploadOnCloudinary(aadhar);
      if (!url) {
        return Response.json(
          { message: "Failed to upload aadhar" },
          { status: 500 },
        );
      } else {
        updatePayload.aadharUrl = url;
      }
    }

    if (license) {
      const url = await uploadOnCloudinary(license);
      if (!url) {
        return Response.json(
          { message: "Failed to upload license" },
          { status: 500 },
        );
      } else {
        updatePayload.licenseUrl = url;
      }
    }

    if (rc) {
      const url = await uploadOnCloudinary(rc);
      if (!url) {
        return Response.json(
          { message: "Failed to upload rc" },
          { status: 500 },
        );
      } else {
        updatePayload.rcUrl = url;
      }
    }
    const partnerDocs = await partnerDocsModel.findOneAndUpdate(
      { owner: session.user.id },
      { $set: updatePayload },
      { upsert: true, new: true },
    );

    if (user.partnerOnBoardingSteps < 2) {
      user.partnerOnBoardingSteps = 2;
    }

    await user.save();

    return Response.json(partnerDocs, { status: 200 });
  } catch (error) {
    return Response.json(
      { message: `Document Upload Error : ${error}` },
      { status: 500 },
    );
  }
}
