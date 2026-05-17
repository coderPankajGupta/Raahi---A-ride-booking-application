"use client";
import axios from "axios";
import { CircleDashed, Lock, Mail, User, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";

type propType = {
  open: boolean;
  onClose: () => void;
};

type stepType = "login" | "signup" | "otp";

type formDataType = {
  name: string;
  email: string;
  password: string;
};

export default function AuthModal({ open, onClose }: propType) {
  const [step, setStep] = useState<stepType>("login");
  const [datas, setDatas] = useState<formDataType>({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  // const { data } = useSession();
  // console.log(data);

  async function handleSignUp() {
    try {
      setLoading(true);
      const response = await axios.post(
        "/api/auth/register",
        {
          name: datas.name,
          email: datas.email,
          password: datas.password,
        },
        { withCredentials: true },
      );
      setErr("");
      setStep("otp");
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      setErr(error.response?.data?.message || "An error occurred");
    }
  }

  async function handleVerifyEmail() {
    setLoading(true);
    try {
      const response = await axios.post("/api/auth/verify-email", {
        email: datas.email,
        otp: otp.join(""),
      });
      console.log(response.data);
      setOtp(["", "", "", "", "", ""]);
      setErr("");
      setStep("login");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setErr("Failed to verify email. Please try again.");
    }
  }

  async function handleLogin() {
    setLoading(true);
    const response = await signIn("credentials", {
      email: datas.email,
      password: datas.password,
      redirect: false,
    });
    if(response?.error) {
      setErr("Invalid email or password");
    }
    setLoading(false);
    console.log(response);
  }

  async function handleGoogleLogin() {
    await signIn("google");
  }

  function handleChangeOtp(index: number, value: string) {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (index < otp.length - 1 && value) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }

    if (!value && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-90"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 40 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="fixed inset-0 z-100 flex items-center justify-center px-4"
            >
              <div className="relative w-full max-w-md rounded-3xl bg-white border border-black/10 shadow-[0_40px_100px_rgba(0,0,0,0.35)] p-6 sm:p-8 text-black">
                <div
                  className="absolute right-4 top-4 text-gray-500 hover:text-black transition"
                  onClick={onClose}
                >
                  <X size={20} />
                </div>

                <div className="mb-6 text-center">
                  <h1 className="text-3xl font-extrabold tracking-widest">
                    RAAHI
                  </h1>
                  <p className="mt-1 text-xs text-gray-500">
                    Premium Vehical Booking
                  </p>
                </div>

                <button
                  className="w-full h-11 rounded-xl border border-black/20 flex items-center justify-center gap-3 text-sm font-semibold hover:bg-black hover:text-white transition"
                  onClick={handleGoogleLogin}
                >
                  {" "}
                  <Image
                    alt="google"
                    src={"/google.webp"}
                    width={20}
                    height={20}
                  />{" "}
                  Continue with Google{" "}
                </button>

                <div className="flex items-center gap-4 my-6">
                  <div className="flex-1 h-px bg-black/10" />
                  <div className="text-xs text-gray-500">OR</div>
                  <div className="flex-1 h-px bg-black/10" />
                </div>

                <div>
                  {step === "login" && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <h1 className="text-xl font-semibold">Welcome back</h1>
                      <div className="mt-5 space-y-4">
                        <div className="flex items-center gap-3 border border-black/20 rounded-xl px-4 py-3">
                          <Mail size={18} className="text-gray-500" />
                          <input
                            type="email"
                            placeholder="Enter your email"
                            className="w-full outline-none bg-transparent text-sm"
                            onChange={(e) =>
                              setDatas((prev) => ({
                                ...prev,
                                email: e.target.value,
                              }))
                            }
                            value={datas.email}
                          />
                        </div>

                        <div className="flex items-center gap-3 border border-black/20 rounded-xl px-4 py-3">
                          <Lock size={18} className="text-gray-500" />
                          <input
                            type="password"
                            placeholder="Password"
                            className="w-full outline-none bg-transparent text-sm"
                            onChange={(e) =>
                              setDatas((prev) => ({
                                ...prev,
                                password: e.target.value,
                              }))
                            }
                            value={datas.password}
                          />
                        </div>

                        {err && <p className="text-red-500">*{err}</p>}

                        <button
                          className="w-full h-11 rounded-xl bg-black text-white font-semibold hover:bg-gray-800 transition cursor-pointer flex items-center justify-center"
                          onClick={handleLogin}
                          disabled={loading}
                        >
                          {loading ? (
                            <CircleDashed
                              size={18}
                              color="white"
                              className="animate-spin"
                            />
                          ) : (
                            "Login"
                          )}
                        </button>
                      </div>

                      <p className="mt-6 text-center text-sm text-gray-500">
                        Don't have an account?{" "}
                        <span
                          className="text-black font-medium cursor-pointer hover:underline"
                          onClick={() => setStep("signup")}
                        >
                          Sign Up
                        </span>
                      </p>
                    </motion.div>
                  )}

                  {step === "signup" && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <h1 className="text-xl font-semibold">Create Account</h1>
                      <div className="mt-5 space-y-4">
                        <div className="flex items-center gap-3 border border-black/20 rounded-xl px-4 py-3">
                          <User size={18} className="text-gray-500" />
                          <input
                            type="text"
                            placeholder="Enter your fullname"
                            className="w-full outline-none bg-transparent text-sm"
                            onChange={(e) =>
                              setDatas((prev) => ({
                                ...prev,
                                name: e.target.value,
                              }))
                            }
                            value={datas.name}
                          />
                        </div>

                        <div className="flex items-center gap-3 border border-black/20 rounded-xl px-4 py-3">
                          <Mail size={18} className="text-gray-500" />
                          <input
                            type="email"
                            placeholder="Enter your email"
                            className="w-full outline-none bg-transparent text-sm"
                            onChange={(e) =>
                              setDatas((prev) => ({
                                ...prev,
                                email: e.target.value,
                              }))
                            }
                            value={datas.email}
                          />
                        </div>

                        <div className="flex items-center gap-3 border border-black/20 rounded-xl px-4 py-3">
                          <Lock size={18} className="text-gray-500" />
                          <input
                            type="password"
                            placeholder="Password"
                            className="w-full outline-none bg-transparent text-sm"
                            onChange={(e) =>
                              setDatas((prev) => ({
                                ...prev,
                                password: e.target.value,
                              }))
                            }
                            value={datas.password}
                          />
                        </div>

                        {err && <p className="text-red-500 text-sm">*{err}</p>}

                        <button
                          className="w-full h-11 rounded-xl bg-black text-white font-semibold hover:bg-gray-800 transition cursor-pointer flex items-center justify-center"
                          onClick={handleSignUp}
                          disabled={loading}
                        >
                          {loading ? (
                            <CircleDashed
                              size={18}
                              color="white"
                              className="animate-spin"
                            />
                          ) : (
                            "Send OTP"
                          )}
                        </button>
                      </div>

                      <p className="mt-6 text-center text-sm text-gray-500">
                        Already have an account?{" "}
                        <span
                          className="text-black font-medium cursor-pointer hover:underline"
                          onClick={() => setStep("login")}
                        >
                          Login
                        </span>
                      </p>
                    </motion.div>
                  )}

                  {step === "otp" && (
                    <motion.div
                      key="otp"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                    >
                      <h2 className="text-xl font-semibold">Verify Email</h2>
                      <div className="mt-6 flex justify-between gap-2">
                        {otp.map((digit, index) => (
                          <input
                            key={index}
                            value={digit}
                            maxLength={1}
                            id={`otp-${index}`}
                            className="w-10 h-12 sm:w-12 text-center text-lg font-semibold rounded-xl bg-white border border-black/20 outline-none"
                            onChange={(e) =>
                              handleChangeOtp(index, e.target.value)
                            }
                          />
                        ))}
                      </div>

                      {err && <p className="text-red-500">*{err}</p>}

                      <button
                        className="mt-6 w-full h-11 rounded-xl bg-black text-white font-semibold hover:bg-gray-900 flex items-center justify-center"
                        onClick={handleVerifyEmail}
                        disabled={loading}
                      >
                        {loading ? (
                          <CircleDashed
                            size={18}
                            color="white"
                            className="animate-spin"
                          />
                        ) : (
                          "Verify and Create Account"
                        )}
                      </button>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
