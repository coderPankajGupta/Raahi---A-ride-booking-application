import connectDB from "@/lib/connectDB";
import { NextRequest } from "next/server";

export async function POST(req:NextRequest) {
    const { name, email, password } = await req.json();
    await connectDB()

    
}