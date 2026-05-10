"use client";
import { useState } from "react";
import AuthModal from "./AuthModal";
import HeroSection from "./HeroSection";
import VehicalSlider from "./VehicalSlider";

export default function PublicHome() {
  const [authOpen, setAuthOpen] = useState(true)
  return (
    <>
      <HeroSection />
      <VehicalSlider /> 
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
