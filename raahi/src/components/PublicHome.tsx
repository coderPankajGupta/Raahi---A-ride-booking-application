"use client";
import { useState } from "react";
import AuthModal from "./AuthModal";
import HeroSection from "./HeroSection";
import VehicleSlider from "./VehicleSlider";

export default function PublicHome() {
  const [authOpen, setAuthOpen] = useState(false);
  return (
    <>
      <HeroSection onAuthOpen={() => setAuthOpen(true)} />
      <VehicleSlider />
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
