"use client";
import axios from "axios";
import {
  ArrowLeft,
  BadgeCheck,
  CheckCircle,
  CircleDashed,
  CreditCard,
  Landmark,
  Phone,
} from "lucide-react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Page() {
  const router = useRouter();
  const [bankDetails, setBankDetails] = useState({
    accountHolder: "",
    accountNumber: "",
    ifsc: "",
    mobileNumber: "",
    upi: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleBank() {
    setLoading(true);
    try {
      const { data } = await axios.post(
        "/api/partner/onboarding/bank",
        bankDetails,
      );
      console.log(data);
      setLoading(false);
    } catch (error: any) {
      setError(error.response?.data?.message ?? "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl bg-white rounded-3xl border border-gray-200 shadow-[0_25px_70px_rgba(0,0,0,0.15)] p-6 sm:p-8"
      >
        <div className="relative text-center">
          <button
            className="absolute left-0 top-0 w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition"
            onClick={() => router.back()}
          >
            <ArrowLeft size={18} />
          </button>

          <p className="text-xs text-gray-500 font-medium">step 3 of 3</p>

          <h1 className="text-2xl font-bold mt-1">Bank & Payout Setup</h1>

          <p className="text-sm text-gray-500 mt-2">Used for partner payouts</p>
        </div>

        <div className="mt-8 space-y-6">
          <div>
            <label
              htmlFor="ahn"
              className="text-gray-500 text-xs font-semibold"
            >
              Account Holder Name
            </label>
            <div className="flex items-center gap-2 mt-2">
              <div className="text-gray-400">
                <BadgeCheck />
              </div>
              <input
                id="ahn"
                type="text"
                placeholder="As per bank records"
                className="flex-1 border-b pb-2 text-sm focus:outline-none border-gray-300 focus:border-black"
                value={bankDetails.accountHolder}
                onChange={(e) =>
                  setBankDetails({
                    ...bankDetails,
                    accountHolder: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="bcn"
              className="text-gray-500 text-xs font-semibold"
            >
              Bank Account Number
            </label>
            <div className="flex items-center gap-2 mt-2">
              <div className="text-gray-400">
                <CreditCard />
              </div>
              <input
                id="bcn"
                type="text"
                placeholder="Enter account number"
                className="flex-1 border-b pb-2 text-sm focus:outline-none border-gray-300 focus:border-black"
                value={bankDetails.accountNumber}
                onChange={(e) =>
                  setBankDetails({
                    ...bankDetails,
                    accountNumber: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="ifscc"
              className="text-gray-500 text-xs font-semibold"
            >
              IFSC Code
            </label>
            <div className="flex items-center gap-2 mt-2">
              <div className="text-gray-400">
                <Landmark />
              </div>
              <input
                id="ifscc"
                type="text"
                placeholder="HDFC0012345"
                className="flex-1 border-b pb-2 text-sm focus:outline-none border-gray-300 focus:border-black"
                value={bankDetails.ifsc}
                onChange={(e) =>
                  setBankDetails({ ...bankDetails, ifsc: e.target.value })
                }
              />
            </div>
          </div>

          <div>
            <label htmlFor="mn" className="text-gray-500 text-xs font-semibold">
              Mobile Number
            </label>
            <div className="flex items-center gap-2 mt-2">
              <div className="text-gray-400">
                <Phone />
              </div>
              <input
                id="mn"
                type="text"
                placeholder="+91 1234567890"
                className="flex-1 border-b pb-2 text-sm focus:outline-none border-gray-300 focus:border-black"
                value={bankDetails.mobileNumber}
                onChange={(e) =>
                  setBankDetails({
                    ...bankDetails,
                    mobileNumber: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="upi"
              className="text-gray-500 text-xs font-semibold"
            >
              UPI Id (Optional)
            </label>
            <div className="flex items-center gap-2 mt-2">
              <input
                id="upi"
                type="text"
                placeholder="name@oksbi"
                className="flex-1 border-b pb-2 text-sm focus:outline-none border-gray-300 focus:border-black"
                value={bankDetails.upi}
                onChange={(e) =>
                  setBankDetails({ ...bankDetails, upi: e.target.value })
                }
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-start gap-3 text-xs text-gray-500">
          <CheckCircle size={16} className="mt-0.5" />{" "}
          <p>
            Bank details are verified before first payout. This usually takes
            24-48 hours.
          </p>
        </div>

        {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="mt-8 w-full h-14 rounded-2xl bg-black text-white font-semibold disabled:opacity-40 transition flex items-center justify-center"
          onClick={handleBank}
          disabled={loading}
        >
          {loading ? (
            <CircleDashed className="text-white animate-spin" />
          ) : (
            "Continue"
          )}
        </motion.button>
      </motion.div>
    </div>
  );
}
