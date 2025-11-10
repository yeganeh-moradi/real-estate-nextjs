"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, Lock, User } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 تابع ثبت‌نام
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "مشکلی در ثبت‌نام پیش آمد ❌");
        return;
      }

      alert("ثبت‌نام با موفقیت انجام شد ✅");

      // ⏩ انتقال به صفحه ورود
      router.push("/signin");
    } catch (error) {
      console.error("Signup error:", error);
      alert("خطا در ارتباط با سرور ⚠️");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-100 to-gray-200 px-4">
      <div className="bg-white/80 backdrop-blur-lg border border-gray-200 shadow-2xl rounded-3xl w-full max-w-md p-10 transition-all duration-300 hover:shadow-[#FEC36055]">
        {/* 🔹 لوگو */}
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

        {/* 🔹 تیتر و توضیح */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">
            ثبت‌نام در سایت
          </h1>
          <p className="text-gray-500 text-sm mt-2">
            اطلاعات خود را وارد کنید تا حساب کاربری شما ساخته شود
          </p>
        </div>

        {/* 🔹 فرم ثبت‌نام */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <User className="absolute right-3 top-3.5 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="نام کامل"
              className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-xl bg-white/70 focus:outline-none focus:ring-2 focus:ring-[#FEC360] focus:border-[#FEC360] shadow-sm transition-all duration-200 text-gray-800 placeholder-gray-400"
              required
            />
          </div>

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

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl font-semibold shadow-md transition-all duration-200 ${
              loading
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-[#FEC360] hover:bg-[#fed27a] text-black"
            }`}
          >
            {loading ? "در حال ثبت..." : "ساخت حساب"}
          </button>
        </form>

        {/* 🔹 لینک ورود */}
        <div className="mt-6 text-center text-gray-600 text-sm">
          قبلاً ثبت‌نام کرده‌اید؟{" "}
          <Link
            href="/signin"
            className="text-[#FEC360] font-semibold hover:underline"
          >
            ورود به حساب
          </Link>
        </div>

        {/* 🔹 جزئیات پایینی */}
        <p className="text-xs text-center text-gray-400 mt-6">
          با ثبت‌نام، با{" "}
          <span className="text-gray-500 underline cursor-pointer hover:text-gray-700">
            قوانین و حریم خصوصی
          </span>{" "}
          موافقت می‌کنید
        </p>
      </div>
    </div>
  );
}
