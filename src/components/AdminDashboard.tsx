"use client";
import axios from "axios";
import { CheckCircle, Clock, User, Users, XCircle } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import Kpi from "./Kpi";

type Stats = {
    totalApprovedPartners: number;
    totalPartners:number;
    totalPendingPartners:number;
    totalRejectedPartners:number;
}
export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats | null>()

  async function handleGetData() {
    try {
      const { data } = await axios.get("/api/admin/dashboard");
        setStats(data.stats);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    handleGetData();
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-100 to-gray-200">
      <div className="sticky top-0 bg-white/80 backdrop-blur-lg border-b z-40">
        <div className="max-w-7xl mx-auto h-16 px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src={"/logo.png"}
              alt="logo"
              className="rounded-xl"
              width={30}
              height={30}
            />
          </div>
          <div className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-full bg-black text-white">
            <User size={14} /> Admin Dashboard
          </div>
        </div>
      </div>
        <main className="max-w-7xl mx-auto py-12 px-6 space-y-16">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                <Kpi label="Total Partners" value={stats?.totalPartners} icon={<Users/>}/>
                <Kpi label="Approved Partners" value={stats?.totalApprovedPartners} icon={<CheckCircle/>}/>
                <Kpi label="Pending Partners" value={stats?.totalPendingPartners} icon={<Clock/>}/>
                <Kpi label="Rejected Partners" value={stats?.totalRejectedPartners} icon={<XCircle/>}/>
            </div>
        </main>

    </div>
  );
}
