"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("ایمیل یا رمز عبور اشتباه است");
      return;
    }

    // موفقیت
    router.push("/");
  };

  return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-100 to-gray-200 px-4">
        <div className="bg-white/80 backdrop-blur-lg border border-gray-200 shadow-2xl rounded-3xl w-full max-w-md p-10 transition-all duration-300 hover:shadow-[#FEC36055]">
          {/* لوگو */}
          <div className="flex justify-center mb-8">
            <Image
                src="/images/logo-gold.png"
                width={140}
                height={140}
                alt="لوگوی سایت"
                className="object-contain drop-shadow-lg"
                priority
            />
          </div>

          {/* عنوان */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">
              ورود به حساب
            </h1>
            <p className="text-gray-500 text-sm mt-2">
              لطفاً برای ادامه، اطلاعات ورود خود را وارد کنید
            </p>
          </div>

          {/* فرم ورود */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <Mail className="absolute right-3 top-3.5 text-gray-400 w-5 h-5" />
              <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ایمیل"
                  className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-xl bg-white/70 focus:outline-none focus:ring-2 focus:ring-[#FEC360] focus:border-[#FEC360] shadow-sm transition-all duration-200 text-gray-800 placeholder-gray-400"
                  required
              />
            </div>

            <div className="relative">
              <Lock className="absolute right-3 top-3.5 text-gray-400 w-5 h-5" />
              <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="رمز عبور"
                  className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-xl bg-white/70 focus:outline-none focus:ring-2 focus:ring-[#FEC360] focus:border-[#FEC360] shadow-sm transition-all duration-200 text-gray-800 placeholder-gray-400"
                  required
              />
            </div>

            {error && <p className="text-red-500 text-center">{error}</p>}

            <button
                type="submit"
                className="w-full bg-[#FEC360] hover:bg-[#fed27a] text-black py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200"
            >
              ورود
            </button>
          </form>

          {/* لینک ثبت‌نام */}
          <div className="mt-6 text-center text-gray-600 text-sm">
            حساب ندارید؟{" "}
            <Link
                href="/signup"
                className="text-[#FEC360] font-semibold hover:underline"
            >
              ثبت‌نام کنید
            </Link>
          </div>

          <p className="text-xs text-center text-gray-400 mt-6">
            © {new Date().getFullYear()} RealEstate | تمام حقوق محفوظ است
          </p>
        </div>
      </div>
  );
}
