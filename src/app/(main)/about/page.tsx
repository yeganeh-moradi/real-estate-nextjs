"use client";

import Image from "next/image";
import { Home, Briefcase, PhoneCall, Award } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#faf8f4] to-[#f2efea] flex flex-col items-center justify-center px-6 py-20">
      {/* Header */}
      <div className="text-center mb-16">
        <Image
          src="/images/building2.png"
          alt="لوگو"
          width={110}
          height={110}
          className="mx-auto mb-6 drop-shadow-md"
        />
        <h1 className="text-5xl font-extrabold text-gray-800 mb-3 tracking-tight">
          درباره من
        </h1>
        <p className="text-gray-500 max-w-2xl mx-auto leading-relaxed text-lg">
          جایی که تخصص، تجربه و اعتماد با هم ترکیب می‌شوند تا مسیر شما به سوی یک انتخاب ملکی مطمئن هموار شود.
        </p>
      </div>

      {/* Content */}
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
        {/* Image section */}
        <div className="relative w-full h-[480px] rounded-3xl overflow-hidden shadow-2xl border border-[#FEC36033]">
          <Image
            src="/images/ahmadi-pic.jpg"
            alt="محراب احمدی"
            fill
            className="object-cover grayscale hover:grayscale-0 transition duration-700"
          />
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/50 to-transparent text-white p-6">
            <h2 className="text-2xl font-semibold">محراب احمدی</h2>
            <p className="text-sm text-gray-200">مشاور رسمی خرید و فروش املاک لوکس</p>
          </div>
        </div>

        {/* Text section */}
        <div className="bg-white/70 backdrop-blur-md border border-[#FEC36033] shadow-xl rounded-3xl p-10 transition hover:shadow-[#FEC36055]">
          <h2 className="text-2xl font-bold text-gray-800 mb-5">
            سلام، من <span className="text-[#FEC360]">محراب احمدی</span> هستم 👋
          </h2>

          <p className="text-gray-700 leading-relaxed mb-6 text-justify">
            با بیش از <strong className="text-[#FEC360]">۸ سال تجربه</strong> در زمینه خرید، فروش و سرمایه‌گذاری ملکی،
            تمرکز من بر روی ایجاد ارتباطی صادقانه و حرفه‌ای با مشتریان است.  
            باور دارم که خرید ملک تنها یک معامله نیست، بلکه قدمی مهم برای ساخت آینده‌ی بهتر شماست.
          </p>

          <p className="text-gray-700 leading-relaxed mb-6 text-justify">
            مأموریت من کمک به شما برای یافتن بهترین فرصت‌های سرمایه‌گذاری در مناطق شاخص تهران، مانند نیاوران،
            زعفرانیه و فرمانیه است — با رویکردی دقیق، شفاف و مطابق با ارزش واقعی بازار.
          </p>

          {/* Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
            <div className="flex items-center gap-3 bg-[#fff9f0] border border-[#FEC36033] rounded-xl p-4">
              <Briefcase className="text-[#FEC360]" />
              <span className="text-gray-800 text-sm font-medium">
                مشاوره تخصصی خرید و فروش املاک
              </span>
            </div>

            <div className="flex items-center gap-3 bg-[#fff9f0] border border-[#FEC36033] rounded-xl p-4">
              <Home className="text-[#FEC360]" />
              <span className="text-gray-800 text-sm font-medium">
                ارزیابی و قیمت‌گذاری دقیق ملک
              </span>
            </div>

            <div className="flex items-center gap-3 bg-[#fff9f0] border border-[#FEC36033] rounded-xl p-4">
              <PhoneCall className="text-[#FEC360]" />
              <span className="text-gray-800 text-sm font-medium">
                ارتباط مستقیم و پاسخ‌گویی سریع
              </span>
            </div>

            <div className="flex items-center gap-3 bg-[#fff9f0] border border-[#FEC36033] rounded-xl p-4">
              <Award className="text-[#FEC360]" />
              <span className="text-gray-800 text-sm font-medium">
                همکاری با برندهای ساختمانی لوکس
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer note */}
      <p className="text-gray-400 text-xs mt-20 text-center">
        © {new Date().getFullYear()} تمامی حقوق برای <span className="text-[#FEC360]">محراب احمدی</span> محفوظ است.
      </p>
    </div>
  );
}
