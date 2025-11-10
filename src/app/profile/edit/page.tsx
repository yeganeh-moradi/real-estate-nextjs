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
  ArrowLeft,
  Camera,
  Save,
  X,
  Upload,
  Loader2,
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
}

const EditProfilePage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    bio: "",
    image: "",
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState("");

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
          setFormData({
            name: userData.name || "",
            phone: userData.phone || "",
            bio: userData.bio || "",
            image: userData.image || "",
          });
          setImagePreview(userData.image ? getImagePath(userData.image) : null);
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // اعتبارسنجی فایل
    if (!file.type.startsWith("image/")) {
      setErrors({ image: "فایل باید یک تصویر باشد" });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors({ image: "حجم فایل نباید بیشتر از 5MB باشد" });
      return;
    }

    setSelectedFile(file);
    setErrors((prev) => ({ ...prev, image: "" }));

    // نمایش پیش‌نمایش
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // آپلود خودکار فایل
    await uploadImage(file);
  };

  // در تابع uploadImage s
  const uploadImage = async (file: File) => {
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // ذخیره نام فایل در فرم
        setFormData((prev) => ({
          ...prev,
          image: result.fileName, // فقط نام فایل
        }));
        setErrors((prev) => ({ ...prev, image: "" }));
      } else {
        setErrors({ image: result.error || "خطا در آپلود عکس" });
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      setErrors({ image: "خطا در آپلود عکس" });
    } finally {
      setUploading(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (formData.name && formData.name.length < 2) {
      newErrors.name = "نام باید حداقل ۲ کاراکتر باشد";
    }

    if (formData.phone && !/^09[0-9]{9}$/.test(formData.phone)) {
      newErrors.phone = "شماره تلفن معتبر نیست";
    }

    if (formData.bio && formData.bio.length > 500) {
      newErrors.bio = "بیوگرافی نباید بیشتر از ۵۰۰ کاراکتر باشد";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSaving(true);
    setSuccess("");

    try {
      const response = await fetch("/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess("پروفایل با موفقیت به‌روزرسانی شد");
        setTimeout(() => {
          router.push("/profile");
        }, 2000);
      } else {
        setErrors({ submit: result.error || "خطا در به‌روزرسانی پروفایل" });
      }
    } catch (error) {
      setErrors({ submit: "خطا در ارتباط با سرور" });
    } finally {
      setSaving(false);
    }
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
          <X className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            خطا در دریافت اطلاعات
          </h2>
          <p className="text-gray-600 mb-4">
            مشکلی در دریافت اطلاعات پروفایل پیش آمده است.
          </p>
          <Link
            href="/profile"
            className="inline-flex items-center gap-2 bg-[#FEC360] text-gray-900 px-6 py-3 rounded-xl font-semibold hover:bg-amber-500 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            بازگشت به پروفایل
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* هدر */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/profile"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
              >
                <ArrowLeft className="w-5 h-5" />
                بازگشت
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">
                ویرایش پروفایل
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* محتوای اصلی */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          {/* عکس پروفایل */}
          <div className="text-center mb-8">
            <div className="relative inline-block">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center overflow-hidden border-2 border-gray-300">
                {imagePreview ? (
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <User className="w-16 h-16 text-gray-400" />
                )}

                {uploading && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                  </div>
                )}
              </div>

              <label className="absolute bottom-2 right-2 bg-[#FEC360] text-gray-900 p-2 rounded-full shadow-lg hover:bg-amber-500 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                <Camera className="w-4 h-4" />
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={uploading}
                />
              </label>
            </div>

            <p className="text-sm text-gray-500 mt-2">
              {uploading ? "در حال آپلود..." : "برای تغییر عکس کلیک کنید"}
            </p>
            {errors.image && (
              <p className="text-sm text-red-600 mt-1">{errors.image}</p>
            )}
          </div>

          {/* پیام موفقیت */}
          {success && (
            <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-xl">
              {success}
            </div>
          )}

          {/* خطای کلی */}
          {errors.submit && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-xl">
              {errors.submit}
            </div>
          )}

          <div className="space-y-6">
            {/* نام */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                نام کامل
              </label>
              <div className="relative">
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <User className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FEC360] focus:border-transparent transition"
                  placeholder="نام و نام خانوادگی"
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* ایمیل (غیرقابل ویرایش) */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                آدرس ایمیل
              </label>
              <div className="relative">
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  id="email"
                  value={userProfile.email || ""}
                  disabled
                  className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-xl bg-gray-100 text-gray-500"
                />
              </div>
              <p className="mt-1 text-sm text-gray-500">
                ایمیل قابل ویرایش نیست
              </p>
            </div>

            {/* تلفن */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                شماره تلفن
              </label>
              <div className="relative">
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Phone className="w-5 h-5" />
                </div>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FEC360] focus:border-transparent transition"
                  placeholder="09xxxxxxxxx"
                />
              </div>
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
              )}
            </div>

            {/* بیوگرافی */}
            <div>
              <label
                htmlFor="bio"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                درباره من
              </label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FEC360] focus:border-transparent transition resize-none"
                placeholder="درباره خودتان بنویسید..."
              />
              <div className="flex justify-between mt-1">
                {errors.bio && (
                  <p className="text-sm text-red-600">{errors.bio}</p>
                )}
                <p
                  className={`text-sm ${
                    formData.bio.length > 500 ? "text-red-600" : "text-gray-500"
                  }`}
                >
                  {formData.bio.length}/500
                </p>
              </div>
            </div>

            {/* دکمه‌های اقدام */}
            <div className="flex gap-4 pt-6 border-t border-gray-200">
              <Link
                href="/profile"
                className="flex-1 flex items-center justify-center gap-2 bg-gray-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-600 transition"
              >
                <X className="w-4 h-4" />
                انصراف
              </Link>

              <button
                type="submit"
                disabled={saving || uploading}
                className="flex-1 flex items-center justify-center gap-2 bg-[#FEC360] text-gray-900 px-6 py-3 rounded-xl font-semibold hover:bg-amber-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                    در حال ذخیره...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    ذخیره تغییرات
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default EditProfilePage;
