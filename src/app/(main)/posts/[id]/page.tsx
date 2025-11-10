import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, Calendar, User } from "lucide-react";
import prisma from "@/lib/prisma";

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  let post = null;
  let error = null;

  try {
    const { id } = await params;
    const parsedId = parseInt(id?.trim(), 10);

    if (isNaN(parsedId)) {
      return (
        <main className="flex flex-col items-center justify-center min-h-[60vh] text-red-600 font-semibold">
          شناسه نامعتبر است.
        </main>
      );
    }

    // 🔹 گرفتن پست از دیتابیس همراه با اطلاعات نویسنده
    post = await prisma.post.findUnique({
      where: { id: parsedId },
      include: {
        author: {
          select: { name: true, email: true },
        },
      },
    });
  } catch (err) {
    console.error("Error fetching post:", err);
    error = "خطا در بارگذاری اطلاعات";
  }

  if (error) {
    return (
      <main className="flex flex-col items-center justify-center min-h-[60vh] text-red-600 font-semibold">
        {error}
      </main>
    );
  }

  if (!post) {
    return (
      <main className="flex flex-col items-center justify-center min-h-[60vh] text-gray-600 font-semibold">
        پستی با این شناسه پیدا نشد.
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* 🔹 دکمه بازگشت */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-700 hover:text-[#FEC360] transition-colors duration-200 mb-8 group"
        >
          <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>بازگشت به مقالات</span>
        </Link>

        {/* 🔹 کارت اصلی پست */}
        <article className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-xl overflow-hidden">
          {/* 🔹 تصویر پست */}
          {post.imageUrl ? (
            <div className="relative w-full h-80 sm:h-96 overflow-hidden">
              <Image
                src={post.imageUrl.startsWith('/') ? post.imageUrl : "/images/" + post.imageUrl}
                alt={post.title || "پست"}
                fill
                className="object-cover"
                priority
              />
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          ) : (
            <div className="w-full h-80 sm:h-96 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <span className="text-gray-400 text-lg">بدون تصویر</span>
            </div>
          )}

          {/* 🔹 محتوای پست */}
          <div className="p-8">
            {/* هدر پست */}
            <div className="mb-6">
              {post.category && (
                <span className="inline-block bg-[#FEC360]/20 text-gray-800 px-4 py-2 rounded-full text-sm font-medium mb-4 border border-[#FEC360]/30">
                  {post.category}
                </span>
              )}
              <h1 className="text-3xl font-extrabold text-gray-800 leading-tight mb-4">
                {post.title || "بدون عنوان"}
              </h1>
              
              {/* اطلاعات نویسنده و تاریخ */}
              <div className="flex items-center gap-6 text-gray-600 text-sm border-b border-gray-100 pb-6">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{post.author?.name || "نامشخص"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(post.createdAt).toLocaleDateString("fa-IR")}</span>
                </div>
              </div>
            </div>

            {/* ✅ نمایش محتوای متنی */}
            {post.content && (
              <div className="prose prose-lg max-w-none text-gray-700 leading-8 mb-8">
                <div className="whitespace-pre-line text-justify">
                  {post.content}
                </div>
              </div>
            )}

            {/* ✅ نمایش ویدیو آپارات اگر موجود بود */}
            {post.embedCode && (
              <div className="my-8 bg-gray-900 rounded-xl overflow-hidden shadow-lg">
                <div
                  className="w-full"
                  dangerouslySetInnerHTML={{ __html: post.embedCode }}
                />
              </div>
            )}

            {/* ✅ اگر فقط لینک ویدیو ساده بود */}
            {!post.embedCode && post.videoUrl && (
              <div className="my-8 bg-gray-900 rounded-xl overflow-hidden shadow-lg">
                <video
                  src={post.videoUrl}
                  controls
                  className="w-full h-auto rounded-lg"
                />
              </div>
            )}

            {/* فوتر پست */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>نویسنده: {post.author?.name || "نامشخص"}</span>
                  {post.author?.email && (
                    <span className="text-gray-400">({post.author.email})</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>انتشار: {new Date(post.createdAt).toLocaleDateString("fa-IR")}</span>
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* 🔹 دکمه بازگشت پایین */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-gray-800 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-900 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <ChevronLeft className="w-4 h-4" />
            بازگشت به صفحه اصلی
          </Link>
        </div>
      </div>
    </main>
  );
}