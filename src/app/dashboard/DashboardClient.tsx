"use client";

import { useState } from "react";
import { LogOut, Home, Users, Building, FileText, ArrowLeft, Menu, X } from "lucide-react";
import Link from "next/link";
import { signOut } from "next-auth/react";

interface DashboardClientProps {
    userName: string;
    userEmail?: string | null;
}

export default function DashboardClient({ userName, userEmail }: DashboardClientProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleSignOut = () => {
        signOut({ callbackUrl: "/" });
    };

    // بررسی ایمن برای userName
    const safeUserName = userName || "کاربر";
    const userInitial = safeUserName.charAt(0).toUpperCase();

    return (
        <div className="flex h-screen bg-gray-100 text-gray-800">
            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden fixed top-4 right-4 z-50 bg-blue-600 text-white p-2 rounded-lg shadow-lg"
            >
                <Menu size={20} />
            </button>

            {/* Sidebar Overlay for Mobile */}
            {isSidebarOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed lg:static inset-y-0 right-0 w-64 bg-white shadow-lg p-6 flex flex-col justify-between
                transform transition-transform duration-300 ease-in-out z-40
                ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
            `}>
                {/* Close Button for Mobile */}
                <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="lg:hidden absolute top-4 left-4 text-gray-500 hover:text-gray-700"
                >
                    <X size={20} />
                </button>

                <div className="mt-8 lg:mt-0">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-[#FEC360] rounded-full flex items-center justify-center">
                            <span className="text-gray-900 font-bold text-lg">
                                {userInitial}
                            </span>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-blue-600">پنل مدیریت</h1>
                            <p className="text-sm text-gray-500">{safeUserName}</p>
                        </div>
                    </div>

                    <nav className="space-y-3">
                        <Link
                            href="/dashboard"
                            onClick={() => setIsSidebarOpen(false)}
                            className="flex items-center gap-3 p-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200"
                        >
                            <Home size={20} />
                            <span>داشبورد اصلی</span>
                        </Link>
                        <Link
                            href="/dashboard/users"
                            onClick={() => setIsSidebarOpen(false)}
                            className="flex items-center gap-3 p-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200"
                        >
                            <Users size={20} />
                            <span>مدیریت کاربران</span>
                        </Link>
                        <Link
                            href="/dashboard/properties"
                            onClick={() => setIsSidebarOpen(false)}
                            className="flex items-center gap-3 p-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200"
                        >
                            <Building size={20} />
                            <span>مدیریت املاک</span>
                        </Link>
                        <Link
                            href="/dashboard/posts"
                            onClick={() => setIsSidebarOpen(false)}
                            className="flex items-center gap-3 p-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200"
                        >
                            <FileText size={20} />
                            <span>مدیریت مقالات</span>
                        </Link>
                    </nav>
                </div>

                <div className="space-y-4">
                    {/* دکمه بازگشت به سایت */}
                    <Link href="/" onClick={() => setIsSidebarOpen(false)}>
                        <button className="flex items-center gap-2 w-full p-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-all duration-200">
                            <ArrowLeft size={18} />
                            بازگشت به سایت
                        </button>
                    </Link>

                    {/* دکمه خروج - دقیقاً مانند نوبار */}
                    <button
                        onClick={handleSignOut}
                        className="flex items-center gap-2 w-full p-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-200"
                    >
                        <LogOut size={18} />
                        خروج از سیستم
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden min-w-0">
                {/* Header */}
                <header className="bg-white shadow-sm p-4 lg:p-6">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                        <div>
                            <h2 className="text-xl mr-12 lg:text-2xl font-bold text-gray-800">خوش آمدید {safeUserName} 👋</h2>
                            <p className="text-gray-600 mt-3 text-sm lg:text-base">به پنل مدیریت خوش آمدید</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-50 px-3 py-1 lg:px-4 lg:py-2 rounded-lg text-blue-700 font-medium text-sm lg:text-base truncate max-w-[200px] lg:max-w-none">
                                {userEmail || "ایمیل موجود نیست"}
                            </div>
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse flex-shrink-0"></div>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <div className="flex-1 p-4 lg:p-6 overflow-y-auto">
                    {/* آمار کلی */}
                    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8">
                        <div className="bg-white shadow rounded-xl lg:rounded-2xl p-4 lg:p-6 border-r-4 border-blue-500">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-base lg:text-lg font-semibold mb-2 text-gray-700">کاربران فعال</h3>
                                    <p className="text-2xl lg:text-3xl font-bold text-blue-600">125</p>
                                </div>
                                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <Users className="w-5 h-5 lg:w-6 lg:h-6 text-blue-600" />
                                </div>
                            </div>
                            <Link href="/dashboard/users" className="text-sm text-blue-500 hover:text-blue-700 mt-3 lg:mt-4 block">
                                مشاهده کاربران →
                            </Link>
                        </div>

                        <div className="bg-white shadow rounded-xl lg:rounded-2xl p-4 lg:p-6 border-r-4 border-green-500">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-base lg:text-lg font-semibold mb-2 text-gray-700">املاک ثبت شده</h3>
                                    <p className="text-2xl lg:text-3xl font-bold text-green-600">۴۵</p>
                                </div>
                                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <Building className="w-5 h-5 lg:w-6 lg:h-6 text-green-600" />
                                </div>
                            </div>
                            <Link href="/dashboard/properties" className="text-sm text-green-500 hover:text-green-700 mt-3 lg:mt-4 block">
                                مشاهده املاک →
                            </Link>
                        </div>

                        <div className="bg-white shadow rounded-xl lg:rounded-2xl p-4 lg:p-6 border-r-4 border-purple-500">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-base lg:text-lg font-semibold mb-2 text-gray-700">مقالات منتشر شده</h3>
                                    <p className="text-2xl lg:text-3xl font-bold text-purple-600">۸۷</p>
                                </div>
                                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <FileText className="w-5 h-5 lg:w-6 lg:h-6 text-purple-600" />
                                </div>
                            </div>
                            <Link href="/dashboard/posts" className="text-sm text-purple-500 hover:text-purple-700 mt-3 lg:mt-4 block">
                                مشاهده مقالات →
                            </Link>
                        </div>
                    </section>

                    {/* آخرین فعالیت‌ها */}
                    <section className="bg-white shadow rounded-xl lg:rounded-2xl p-4 lg:p-6">
                        <h3 className="text-lg lg:text-xl font-semibold mb-4 lg:mb-6 text-gray-800">آخرین فعالیت‌ها</h3>
                        <div className="space-y-3 lg:space-y-4">
                            <div className="flex items-center gap-3 lg:gap-4 p-3 lg:p-4 bg-gray-50 rounded-lg lg:rounded-xl">
                                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <Users className="w-4 h-4 lg:w-5 lg:h-5 text-blue-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-sm lg:text-base truncate">کاربر جدید ثبت نام کرد</p>
                                    <p className="text-xs lg:text-sm text-gray-500">۲ ساعت پیش</p>
                                </div>
                                <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs lg:text-sm flex-shrink-0">
                                    کاربران
                                </span>
                            </div>

                            <div className="flex items-center gap-3 lg:gap-4 p-3 lg:p-4 bg-gray-50 rounded-lg lg:rounded-xl">
                                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <Building className="w-4 h-4 lg:w-5 lg:h-5 text-green-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-sm lg:text-base truncate">ملک جدید اضافه شد</p>
                                    <p className="text-xs lg:text-sm text-gray-500">۵ ساعت پیش</p>
                                </div>
                                <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs lg:text-sm flex-shrink-0">
                                    املاک
                                </span>
                            </div>

                            <div className="flex items-center gap-3 lg:gap-4 p-3 lg:p-4 bg-gray-50 rounded-lg lg:rounded-xl">
                                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <FileText className="w-4 h-4 lg:w-5 lg:h-5 text-purple-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-sm lg:text-base truncate">مقاله جدید منتشر شد</p>
                                    <p className="text-xs lg:text-sm text-gray-500">۱ روز پیش</p>
                                </div>
                                <span className="bg-purple-100 text-purple-600 px-2 py-1 rounded-full text-xs lg:text-sm flex-shrink-0">
                                    مقالات
                                </span>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}