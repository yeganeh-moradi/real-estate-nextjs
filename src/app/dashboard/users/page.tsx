import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function UsersPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        return (
            <div className="flex h-screen items-center justify-center text-gray-700">
                برای مشاهده کاربران باید وارد شوید.
            </div>
        );
    }

    // دریافت کاربران از دیتابیس
    const users = await prisma.user.findMany({
        select: { id: true, name: true, email: true, createdAt: true },
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-gray-800">مدیریت کاربران</h1>
                <Link
                    href="/dashboard"
                    className="text-blue-600 hover:text-blue-800 text-sm"
                >
                    ← بازگشت به داشبورد
                </Link>
            </div>

            {/* جدول کاربران */}
            <div className="overflow-x-auto bg-white shadow-md rounded-xl">
                <table className="min-w-full table-auto border-collapse">
                    <thead className="bg-blue-100 text-gray-700">
                    <tr>
                        <th className="py-3 px-4 text-right">#</th>
                        <th className="py-3 px-4 text-right">نام</th>
                        <th className="py-3 px-4 text-right">ایمیل</th>
                        <th className="py-3 px-4 text-right">تاریخ عضویت</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.length === 0 ? (
                        <tr>
                            <td colSpan={4} className="text-center py-6 text-gray-500">
                                هیچ کاربری ثبت نشده است.
                            </td>
                        </tr>
                    ) : (
                        users.map((user, index) => (
                            <tr
                                key={user.id}
                                className="border-t hover:bg-blue-50 transition"
                            >
                                <td className="py-3 px-4">{index + 1}</td>
                                <td className="py-3 px-4">{user.name || "—"}</td>
                                <td className="py-3 px-4">{user.email}</td>
                                <td className="py-3 px-4">
                                    {new Date(user.createdAt).toLocaleDateString("fa-IR")}
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
