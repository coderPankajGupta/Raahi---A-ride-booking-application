"use client";
import { Bike, Bus, Car, Truck } from "lucide-react";
import { motion } from "motion/react";

export default function HeroSection({onAuthOpen}:{onAuthOpen:()=>void}) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/heroImage.jpg')" }}
      />

      <div className="absolute inset-0 bg-black/80" />

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-white font-extrabold text-4xl sm:text-5xl md:text-7xl"
        >
          Book Your Vehicale with Ease
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-gray-300 max-w-xl mt-4"
        >
          Discover the best deals on vehicle rentals - All in oneplace.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 flex gap-8 text-gray-300"
        >
          <Bike size={30} />
          <Car size={30} />
          <Bus size={30} />
          <Truck size={30} />
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-12 px-10 py-4 bg-white text-black rounded-full font-semibold shadow-xl"
          onClick={onAuthOpen}
        >
          Book Now
        </motion.button>
      </div>
    </div>
  );
}
