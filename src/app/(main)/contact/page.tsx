"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import Image from "next/image";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", form);
    // در آینده میشه اینجا API تماس یا ایمیل رو اضافه کرد
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 flex flex-col items-center justify-center px-6 py-16">
      {/* Header section */}
      <div className="text-center mb-10">
        <Image
          src="/images/building2.png"
          alt="لوگو"
          width={100}
          height={100}
          className="mx-auto mb-4 drop-shadow-lg"
        />
        <h1 className="text-4xl font-extrabold text-gray-800 mb-2">تماس با من</h1>
        <p className="text-gray-500 max-w-md mx-auto leading-relaxed">
          اگر سوال، پیشنهاد یا پروژه‌ای برای همکاری دارید، خوشحال می‌شم باهام در ارتباط باشید.
        </p>
      </div>

      {/* Main content */}
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Contact Info */}
        <div className="bg-white/80 backdrop-blur-md border border-gray-200 shadow-xl rounded-3xl p-8 flex flex-col justify-center space-y-6 hover:shadow-[#FEC36055] transition">
          <h2 className="text-2xl font-bold text-gray-800 mb-2 border-b border-gray-200 pb-3">
            اطلاعات تماس
          </h2>

          <div className="flex items-center space-x-3 space-x-reverse">
            <Mail className="text-[#FEC360]" />
            <span className="text-gray-700 text-sm select-all">Mehrabahmadifabilsara@gmail.com</span>
          </div>

          <div className="flex items-center space-x-3 space-x-reverse">
            <Phone className="text-[#FEC360]" />
            <span className="text-gray-700 text-sm select-all"> ۰۹۰۲۰۰۷۹۱۰۱ </span>
          </div>

          <div className="flex items-center space-x-3 space-x-reverse">
            <MapPin className="text-[#FEC360]" />
            <span className="text-gray-700 text-sm">
              تهران
            </span>
          </div>

          <div className="mt-4 flex items-center space-x-4 space-x-reverse">
            <a
              href="https://t.me/yourusername"
              target="_blank"
              className="text-gray-500 hover:text-[#FEC360] transition"
            >
              <i className="fa-brands fa-telegram text-2xl"></i>
            </a>
            <a
              href="https://wa.me/989120000000"
              target="_blank"
              className="text-gray-500 hover:text-[#FEC360] transition"
            >
              <i className="fa-brands fa-whatsapp text-2xl"></i>
            </a>
            <a
              href="https://instagram.com/yourusername"
              target="_blank"
              className="text-gray-500 hover:text-[#FEC360] transition"
            >
              <i className="fa-brands fa-instagram text-2xl"></i>
            </a>
          </div>
        </div>

        {/* Contact Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white/80 backdrop-blur-md border border-gray-200 shadow-xl rounded-3xl p-8 space-y-6 hover:shadow-[#FEC36055] transition"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-2 border-b border-gray-200 pb-3">
            فرم ارتباط مستقیم
          </h2>

          <div>
            <label className="block text-gray-700 mb-1 text-sm">نام</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="نام شما"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white/70 focus:outline-none focus:ring-2 focus:ring-[#FEC360] focus:border-[#FEC360] text-gray-800 placeholder-gray-400 transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1 text-sm">ایمیل</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="example@email.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white/70 focus:outline-none focus:ring-2 focus:ring-[#FEC360] focus:border-[#FEC360] text-gray-800 placeholder-gray-400 transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1 text-sm">پیام شما</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="متن پیام..."
              rows={5}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white/70 focus:outline-none focus:ring-2 focus:ring-[#FEC360] focus:border-[#FEC360] text-gray-800 placeholder-gray-400 transition-all resize-none"
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-[#FEC360] hover:bg-[#fed27a] text-black py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200 flex justify-center items-center space-x-2 space-x-reverse"
          >
            <Send className="w-4 h-4 ml-1" />
            ارسال پیام
          </button>
        </form>
      </div>

      {/* Footer note */}
      <p className="text-gray-400 text-xs mt-10 text-center">
        © {new Date().getFullYear()} تمام حقوق برای شما محفوظ است.
      </p>
    </div>
  );
}
