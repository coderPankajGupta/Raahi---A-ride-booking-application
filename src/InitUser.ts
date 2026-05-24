"use client";
import { useSession } from "next-auth/react";
import useGetMe from "./hooks/useGetMe";
import { useState, useEffect } from "react";

export default function InitUser() {
  const { status } = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useGetMe(mounted && status === "authenticated");
  return null;
}