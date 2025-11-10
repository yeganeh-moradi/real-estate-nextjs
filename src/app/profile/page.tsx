"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  User,
  Mail,
  Phone,
  Edit3,
  Calendar,
  Shield,
  CheckCircle,
  XCircle,
  Home,
  FileText,
  ArrowLeft
} from "lucide-react";
import Link from "next/link";

interface UserProfile {
  id: number;
  name: string | null;
  email: string | null;
  phone: string | null;
  image: string | null;
  bio: string | null;
  isVerified: boolean;
  role: string;
  createdAt: string;
  updatedAt: string;
  _count: {
    properties: number;
    posts: number;
  };
}

const ProfilePage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (status === "loading") return;

      if (!session) {
        router.push("/signin");
        return;
      }

      try {
        const response = await fetch("/api/users/profile");
        if (response.ok) {
          const userData = await response.json();
          setUserProfile(userData);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [session, status, router]);

  // در صفحات نمایش و ویرایش پروفایل
  const getImagePath = (imageName: string | null) => {
    if (!imageName) return null;

    // اگر imagePath یک URL کامل است (از قبل ذخیره شده)
    if (imageName.startsWith("http")) {
      return imageName;
    }

    // ساخت URL برای دسترسی از طریق API
    return `/api/images/profiles/${imageName}`;
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FEC360]"></div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            خطا در دریافت اطلاعات
          </h2>
          <p className="text-gray-600 mb-4">
            مشکلی در دریافت اطلاعات پروفایل پیش آمده است.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-[#FEC360] text-gray-900 px-6 py-3 rounded-xl font-semibold hover:bg-amber-500 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            بازگشت به صفحه اصلی
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* هدر */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
              >
                <ArrowLeft className="w-5 h-5" />
                بازگشت
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">
                پروفایل کاربری
              </h1>
            </div>
            <Link
              href="/profile/edit"
              className="flex items-center gap-2 bg-[#FEC360] text-gray-900 px-4 py-2 rounded-xl font-semibold hover:bg-amber-500 transition"
            >
              <Edit3 className="w-4 h-4" />
              ویرایش پروفایل
            </Link>
          </div>
        </div>
      </header>

      {/* محتوای اصلی */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* سایدبار اطلاعات کاربر */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
              {/* عکس پروفایل */}
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center overflow-hidden">
                    {userProfile.image ? (
                      <Image
                        src={
                          getImagePath(userProfile.image) ||
                          "/images/placeholder-avatar.jpg"
                        }
                        alt={userProfile.name || "User"}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          const target = e.currentTarget as HTMLImageElement;
                          target.style.display = "none";
                        }}
                      />
                    ) : (
                      <User className="w-16 h-16 text-gray-400" />
                    )}
                  </div>
                </div>

                <h2 className="text-xl font-bold text-gray-900 mt-4">
                  {userProfile.name || "بدون نام"}
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  {userProfile.email}
                </p>

                {/* وضعیت تأیید */}
                <div
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium mt-2 ${
                    userProfile.isVerified
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {userProfile.isVerified ? (
                    <CheckCircle className="w-3 h-3" />
                  ) : (
                    <XCircle className="w-3 h-3" />
                  )}
                  {userProfile.isVerified
                    ? "حساب تأیید شده"
                    : "در انتظار تأیید"}
                </div>
              </div>

              {/* آمار کاربر */}
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2">
                    <Home className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">املاک ثبت شده</span>
                  </div>
                  <span className="font-bold text-gray-900">
                    {userProfile._count.properties}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      مقالات نوشته شده
                    </span>
                  </div>
                  <span className="font-bold text-gray-900">
                    {userProfile._count.posts}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* اطلاعات اصلی */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6">
                اطلاعات شخصی
              </h3>

              <div className="space-y-6">
                {/* نام */}
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-500">
                      نام کامل
                    </label>
                    <p className="text-gray-900 font-medium">
                      {userProfile.name || "ثبت نشده"}
                    </p>
                  </div>
                </div>

                {/* ایمیل */}
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Mail className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-500">
                      آدرس ایمیل
                    </label>
                    <p className="text-gray-900 font-medium">
                      {userProfile.email}
                    </p>
                  </div>
                </div>

                {/* تلفن */}
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Phone className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-500">
                      شماره تلفن
                    </label>
                    <p className="text-gray-900 font-medium">
                      {userProfile.phone || "ثبت نشده"}
                    </p>
                  </div>
                </div>

                {/* نقش */}
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-500">
                      نقش کاربری
                    </label>
                    <p className="text-gray-900 font-medium">
                      {userProfile.role === "ADMIN" ? "مدیر" : "کاربر عادی"}
                    </p>
                  </div>
                </div>

                {/* تاریخ عضویت */}
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-500">
                      تاریخ عضویت
                    </label>
                    <p className="text-gray-900 font-medium">
                      {new Date(userProfile.createdAt).toLocaleDateString(
                        "fa-IR"
                      )}
                    </p>
                  </div>
                </div>

                {/* بیوگرافی */}
                {userProfile.bio && (
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <label className="block text-sm font-medium text-gray-500 mb-2">
                      درباره من
                    </label>
                    <p className="text-gray-700 leading-relaxed">
                      {userProfile.bio}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* دکمه‌های اقدام */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <Link
                href="/dashboard/properties"
                className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-4 rounded-xl font-semibold hover:bg-blue-700 transition text-center"
              >
                <Home className="w-5 h-5" />
                مدیریت املاک
              </Link>

              <Link
                href="/dashboard/posts"
                className="flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-4 rounded-xl font-semibold hover:bg-green-700 transition text-center"
              >
                <FileText className="w-5 h-5" />
                مدیریت مقالات
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
