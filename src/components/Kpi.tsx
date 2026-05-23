"use client";
import { motion } from "motion/react";

const KPI_CONFIG: Record<
  string,
  { iconBg: string; iconColor: string; cardHover: string }
> = {
  totalPartners: {
    iconBg: "bg-purple-50",
    iconColor: "text-purple-700",
    cardHover: "hover:shadow-purple-100/60",
  },
  approved: {
    iconBg: "bg-blue-50",
    iconColor: "text-blue-800",
    cardHover: "hover:shadow-blue-100/60",
  },
  pending: {
    iconBg: "bg-amber-50",
    iconColor: "text-amber-800",
    cardHover: "hover:shadow-amber-100/60",
  },
  rejected: {
    iconBg: "bg-red-50",
    iconColor: "text-red-800",
    cardHover: "hover:shadow-red-100/60",
  },
};

export default function Kpi({ label, value, icon }: any) {
  return <motion.div></motion.div>;
}
