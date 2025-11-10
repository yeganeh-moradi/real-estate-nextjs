import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import Link from "next/link";
import DeletePostButton from "@/components/DeletePostButton";
import { Eye, Edit3, FileText, Calendar } from "lucide-react";

export default async function PostsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <div className="flex h-screen items-center justify-center text-gray-700">
        برای مشاهده پست‌ها باید وارد شوید.
      </div>
    );
  }

  // دریافت لیست پست‌ها از دیتابیس
  const posts = await prisma.post.findMany({
    select: {
      id: true,
      title: true,
      content: true,
      category: true,
      published: true,
      imageUrl: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">مدیریت پست‌ها</h1>
        <Link
          href="/dashboard"
          className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
        >
          ← بازگشت به داشبورد
        </Link>
      </div>

      {/* دکمه افزودن پست جدید */}
      <div className="mb-6 flex justify-between items-center">
        <Link
          href="/dashboard/posts/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2"
        >
          <FileText className="w-4 h-4" />
          افزودن پست جدید
        </Link>
        
        <div className="text-sm text-gray-600">
          تعداد پست‌ها: {posts.length}
        </div>
      </div>

      {/* جدول پست‌ها */}
      <div className="overflow-x-auto bg-white shadow-md rounded-xl">
        <table className="min-w-full table-auto border-collapse">
          <thead className="bg-blue-100 text-gray-700">
            <tr>
              <th className="py-3 px-4 text-right">#</th>
              <th className="py-3 px-4 text-right">عنوان</th>
              <th className="py-3 px-4 text-right">دسته‌بندی</th>
              <th className="py-3 px-4 text-right">وضعیت</th>
              <th className="py-3 px-4 text-right">تاریخ انتشار</th>
              <th className="py-3 px-4 text-right">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-12 text-gray-500">
                  <div className="flex flex-col items-center gap-3">
                    <FileText className="w-12 h-12 text-gray-300" />
                    <p className="text-lg">هیچ پستی ثبت نشده است.</p>
                    <Link
                      href="/dashboard/posts/new"
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      اولین پست خود را ایجاد کنید
                    </Link>
                  </div>
                </td>
              </tr>
            ) : (
              posts.map((post, index) => (
                <tr
                  key={post.id}
                  className="border-t hover:bg-blue-50 transition group"
                >
                  <td className="py-3 px-4">{index + 1}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      {post.imageUrl && (
                        <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                          <FileText className="w-4 h-4 text-gray-500" />
                        </div>
                      )}
                      <span className="font-medium text-gray-800 line-clamp-1">
                        {post.title}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      post.category 
                        ? "bg-green-100 text-green-800" 
                        : "bg-gray-100 text-gray-600"
                    }`}>
                      {post.category || "بدون دسته"}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      post.published 
                        ? "bg-green-100 text-green-800" 
                        : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {post.published ? "منتشر شده" : "پیش‌نویس"}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(post.createdAt).toLocaleDateString("fa-IR")}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-3 justify-end">
                      <Link
                        href={`/posts/${post.id}`}
                        className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1 transition group-hover:scale-105"
                      >
                        <Eye className="w-3 h-3" />
                        مشاهده
                      </Link>
                      <Link
                        href={`/dashboard/posts/edit/${post.id}`}
                        className="text-green-600 hover:text-green-800 text-sm flex items-center gap-1 transition group-hover:scale-105"
                      >
                        <Edit3 className="w-3 h-3" />
                        ویرایش
                      </Link>
                      <DeletePostButton
                        postId={post.id}
                        postTitle={post.title}
                      />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* آمار پایین صفحه */}
      {posts.length > 0 && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">کل پست‌ها</p>
                <p className="text-xl font-bold text-gray-800">{posts.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">پست‌های منتشر شده</p>
                <p className="text-xl font-bold text-gray-800">
                  {posts.filter(post => post.published).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">پست‌های پیش‌نویس</p>
                <p className="text-xl font-bold text-gray-800">
                  {posts.filter(post => !post.published).length}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}