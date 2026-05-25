import { auth } from "@/auth";
import connectDB from "@/lib/connectDB";
import userModel from "@/models/user.model";

export async function GET(){
    try {
        await connectDB()
        const session = await auth()
        if(!session || !session.user?.email || session.user?.role !== "admin") {
            return Response.json({message: "Unauthorized"},{status:400})
        }
        const partner = await userModel.find({role:"partner",videoKycStatus:{$in:["pending","in_progress"]}})

        return Response.json(partner,{status:200})
    } catch (error) {
        return Response.json({message:`Partner kyc get error : ${error}`},{status:500})
    }
}