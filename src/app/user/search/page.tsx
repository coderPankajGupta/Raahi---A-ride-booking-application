"use client";
import SearchMap from "@/components/SearchMap";
import { ArrowLeft } from "lucide-react";
import { motion } from "motion/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function Page() {
  const router = useRouter();
  const params = useSearchParams();
  const [pickUp, setPickUp] = useState(params.get("pickup") || "");
  const [drop, setDrop] = useState(params.get("drop") || "");
  const [km, setKm] = useState<Number>();
  const mobile = params.get("mobile");
  const vehicle = params.get("vehicle");
  const pickUpLat = Number(params.get("pickuplat"));
  const pickUpLon = Number(params.get("pickuplon"));
  const dropLon = Number(params.get("droplon"));
  const dropLat = Number(params.get("droplat"));

  return (
    <div className="min-h-screen bg-zinc-100 text-zinc-900 overflow-x-hidden">
      {/* back button  */}
      <div className="absolute top-5 left-5 z-50">
        <motion.div
          whileTap={{ scale: 0.88 }}
          onClick={() => router.back()}
          className="w-11 h-11 rounded-full bg-white border border-zinc-200 shadow-md flex items-center justify-center hover:bg-zinc-50 transition-colors"
        >
          <ArrowLeft size={17} className="text-zinc-900" />
        </motion.div>
      </div>

      <div className="relative w-full h-[52vh] z-0">
        <SearchMap
          pickUp={pickUp}
          drop={drop}
          onChange={(p, d) => {
            setPickUp(p);
            setDrop(d);
          }}
          onDistance = {setKm}
        />
      </div>
    </div>
  );
}
