import connectDB from "@/lib/connectDB";
import { auth } from "@/auth";
import userModel from "@/models/user.model";

export async function GET(req: Request) {
  try {
    await connectDB();
    const session = await auth();
    if (!session || !session.user) {
      return Response.json(
        { message: `User is not authorize` },
        { status: 400 },
      );
    }

    const user = await userModel.findOne({ email: session.user?.email });
    if (!user) {
      return Response.json({ message: `User is not found` }, { status: 400 });
    }

    return Response.json(user, { status: 200 });
  } catch (error) {
    return Response.json({ message: `Getting me error ${error}` }, { status: 500 });
  }
}
