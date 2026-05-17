"use client";
import { useSession } from "next-auth/react";
import useGetMe from "./hooks/useGetMe";

export default function InitUser() {
  const { status } = useSession();
  useGetMe(status == "authenticated");
  return null;
}
