"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  FileText,
  Image,
  Video,
  Code,
  Eye,
  EyeOff,
  Upload,
  X
} from "lucide-react";

export default function NewPostPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    published: false,
    imageUrl: "",
    videoUrl: "",
    embedCode: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState("");
  const [previewMode, setPreviewMode] = useState(false);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!session) {
    router.push("/signin");
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));

    // حذف خطای فیلد هنگام تایپ
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "عنوان پست الزامی است";
    } else if (formData.title.trim().length < 2) {
      newErrors.title = "عنوان باید حداقل ۲ کاراکتر باشد";
    }

    if (!formData.content.trim()) {
      newErrors.content = "محتوای پست الزامی است";
    } else if (formData.content.trim().length < 10) {
      newErrors.content = "محتوای پست باید حداقل ۱۰ کاراکتر باشد";
    }

    if (formData.category && formData.category.length > 50) {
      newErrors.category = "دسته‌بندی نباید بیشتر از ۵۰ کاراکتر باشد";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setSuccess("");

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess("پست جدید با موفقیت ایجاد شد");
        setTimeout(() => {
          router.push("/dashboard/posts");
        }, 1500);
      } else {
        setErrors({ submit: result.error || "خطا در ایجاد پست" });
      }
    } catch (error) {
      setErrors({ submit: "خطا در ارتباط با سرور" });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      title: "",
      content: "",
      category: "",
      published: false,
      imageUrl: "",
      videoUrl: "",
      embedCode: ""
    });
    setErrors({});
    setSuccess("");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* هدر */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard/posts"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
              >
                <ArrowLeft className="w-5 h-5" />
                بازگشت به مدیریت پست‌ها
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">ایجاد پست جدید</h1>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setPreviewMode(!previewMode)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                {previewMode ? (
                  <>
                    <EyeOff className="w-4 h-4" />
                    خروج از پیش‌نمایش
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4" />
                    پیش‌نمایش
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* محتوای اصلی */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {previewMode ? (
          /* حالت پیش‌نمایش */
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{formData.title || "عنوان پست"}</h2>
            
            {formData.category && (
              <div className="mb-6">
                <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {formData.category}
                </span>
              </div>
            )}

            {formData.imageUrl && (
              <div className="mb-6">
                <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                  <Image className="w-12 h-12 text-gray-400" />
                  <span className="text-gray-500 mr-2">پیش‌نمایش تصویر</span>
                </div>
              </div>
            )}

            <div className="prose max-w-none">
              <p className="text-gray-700 leading-7 whitespace-pre-line">
                {formData.content || "محتوای پست اینجا نمایش داده می‌شود..."}
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>وضعیت: {formData.published ? "منتشر شده" : "پیش‌نویس"}</span>
                <span>تاریخ: {new Date().toLocaleDateString("fa-IR")}</span>
              </div>
            </div>
          </div>
        ) : (
          /* حالت فرم */
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6">
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* ستون اصلی */}
              <div className="lg:col-span-2 space-y-6">
                {/* عنوان */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    عنوان پست *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="عنوان جذاب و توصیفی برای پست خود وارد کنید..."
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                  )}
                </div>

                {/* محتوا */}
                <div>
                  <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                    محتوای پست *
                  </label>
                  <textarea
                    id="content"
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    rows={12}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                    placeholder="محتوای کامل پست خود را اینجا بنویسید..."
                  />
                  <div className="flex justify-between mt-1">
                    {errors.content && (
                      <p className="text-sm text-red-600">{errors.content}</p>
                    )}
                    <p className="text-sm text-gray-500">
                      {formData.content.length} کاراکتر
                    </p>
                  </div>
                </div>
              </div>

              {/* سایدبار */}
              <div className="space-y-6">
                {/* وضعیت انتشار */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    وضعیت انتشار
                  </h3>
                  
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="published"
                        checked={formData.published}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">انتشار فوری پست</span>
                    </label>
                    
                    <p className="text-xs text-gray-500">
                      {formData.published 
                        ? "پست بلافاصله در سایت نمایش داده می‌شود" 
                        : "پست به عنوان پیش‌نویس ذخیره می‌شود"
                      }
                    </p>
                  </div>
                </div>

                {/* دسته‌بندی */}
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                    دسته‌بندی
                  </label>
                  <input
                    type="text"
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="مثلاً: املاک، سرمایه‌گذاری..."
                  />
                  {errors.category && (
                    <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                  )}
                </div>

                {/* رسانه */}
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">رسانه</h3>
                  
                  {/* تصویر شاخص */}
                  <div>
                    <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <Image className="w-4 h-4" />
                      آدرس تصویر شاخص
                    </label>
                    <input
                      type="url"
                      id="imageUrl"
                      name="imageUrl"
                      value={formData.imageUrl}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  {/* ویدیو */}
                  <div>
                    <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <Video className="w-4 h-4" />
                      آدرس ویدیو
                    </label>
                    <input
                      type="url"
                      id="videoUrl"
                      name="videoUrl"
                      value={formData.videoUrl}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm"
                      placeholder="https://youtube.com/embed/..."
                    />
                  </div>

                  {/* کد امبد */}
                  <div>
                    <label htmlFor="embedCode" className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <Code className="w-4 h-4" />
                      کد امبد
                    </label>
                    <textarea
                      id="embedCode"
                      name="embedCode"
                      value={formData.embedCode}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm resize-none"
                      placeholder='<iframe src="..." />'
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* دکمه‌های اقدام */}
            <div className="flex gap-4 pt-8 mt-8 border-t border-gray-200">
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition"
              >
                <X className="w-4 h-4" />
                پاک کردن فرم
              </button>
              
              <div className="flex-1 flex gap-4 justify-end">
                <Link
                  href="/dashboard/posts"
                  className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition"
                >
                  انصراف
                </Link>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      در حال ذخیره...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      {formData.published ? "انتشار پست" : "ذخیره پیش‌نویس"}
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}