"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Menu,
  X,
  User,
  LogOut,
  LayoutDashboard,
  Home,
  Building,
  FileText,
  Info,
  Phone,
  ChevronDown,
  Search,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

interface NavLink {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface UserProfile {
  id: number;
  name: string;
  email: string;
  image?: string | null;
}

const navLinks: NavLink[] = [
  { label: "صفحه اصلی", href: "/", icon: Home },
  { label: "املاک", href: "/listings", icon: Building },
  { label: "درباره ما", href: "/about", icon: Info },
  { label: "تماس با ما", href: "/contact", icon: Phone },
];

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const { data: session } = useSession();
  const pathname = usePathname();

  // دریافت اطلاعات کاربر از دیتابیس
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (session?.user?.email) {
        try {
          // تغییر این خط - بدون پارامتر email
          const response = await fetch('/api/users/profile');
          if (response.ok) {
            const userData = await response.json();
            setUserProfile(userData);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      }
    };

    fetchUserProfile();
  }, [session]);

  const userName = userProfile?.name || session?.user?.name || null;
  const userEmail = userProfile?.email || session?.user?.email || null;
  const userImage = userProfile?.image || session?.user?.image || null;

  // تابع برای ساخت مسیر کامل عکس
  const getImagePath = (imageName: string | null) => {
    if (!imageName) return null;

    // اگر عکس از providerهای خارجی باشد (مثل Google)
    if (imageName.startsWith("http")) {
      return imageName;
    }

    // اگر فقط نام فایل در دیتابیس ذخیره شده باشد
    return `/api/images/profiles/${imageName}`;
  };

  // افکت برای تشخیص اسکرول
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // بستن منوها هنگام تغییر مسیر
  useEffect(() => {
    setIsOpen(false);
    setIsUserMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className={`fixed w-full z-50 top-0 bg-gray-900 transition-all duration-500 ${
        isScrolled ? "shadow-2xl border-b border-gray-700" : ""
      }`}
    >
      <nav className="w-full bg-gray-900 h-20 flex items-center justify-between mx-auto px-4 lg:px-8">
        {/* لوگو و بخش سمت راست */}
        <div className="flex items-center gap-8">
          {/* لوگو */}
          <Link
            href="/"
            className="flex items-center gap-3 group transition-transform hover:scale-105"
          >
            <div className="relative w-25 h-25">
              <Image
                src="/images/logo-gold.svg"
                alt="لوگو خان"
                fill
                priority
                className="object-contain"
              />
            </div>
          </Link>

          {/* منوی دسکتاپ */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 group relative ${
                    isActive
                      ? "text-[#FEC360] bg-amber-50"
                      : "text-white hover:text-[#FEC360] hover:bg-white/10"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                  {isActive && (
                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-[#FEC360] rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* بخش سمت چپ - جستجو و کاربر */}
        <div className="flex items-center gap-4">
          {/* نوار جستجو */}
          <div
            className={`hidden md:flex items-center transition-all duration-300 bg-white/10 rounded-2xl px-4 py-2 min-w-80`}
          >
            <Search className="w-5 h-5 text-white" />
            <input
              type="text"
              placeholder="جستجوی ملک، مقاله یا مکان..."
              className="bg-transparent border-none outline-none pr-3 w-full text-sm text-white placeholder:text-white/70 text-right"
            />
          </div>

          {/* بخش کاربر */}
          {userName ? (
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-3 p-2 rounded-2xl transition-all duration-300 group hover:bg-white/10"
              >
                {/* نمایش عکس پروفایل از دیتابیس یا آواتار */}
                {userImage ? (
                  <div className="relative w-10 h-10">
                    <Image
                      src={
                        getImagePath(userImage) ||
                        "/images/placeholder-avatar.jpg"
                      }
                      alt={userName}
                      fill
                      className="rounded-full object-cover ring-2 ring-white/20"
                      onError={(e) => {
                        // اگر عکس لود نشد، آواتار نمایش داده شود
                        const target = e.currentTarget as HTMLImageElement;
                        target.src = "";
                        target.style.display = "none";
                      }}
                    />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#FEC360] to-amber-500 flex items-center justify-center text-white font-bold text-sm shadow-lg ring-2 ring-white/20">
                    {userName.charAt(0)}
                  </div>
                )}

                <div className="hidden lg:block text-right">
                  <p className="font-medium text-sm text-white">{userName}</p>
                  <p className="text-xs text-white/70">{userEmail}</p>
                </div>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-300 ${
                    isUserMenuOpen ? "rotate-180" : ""
                  } text-white`}
                />
              </button>

              {/* منوی کاربر */}
              {isUserMenuOpen && (
                <div className="absolute left-0 mt-2 w-64 bg-white/95 rounded-2xl shadow-2xl border border-gray-100 py-2">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      {/* عکس پروفایل از دیتابیس در منو */}
                      {userImage ? (
                        <div className="relative w-12 h-12">
                          <Image
                            src={
                              getImagePath(userImage) ||
                              "/images/placeholder-avatar.jpg"
                            }
                            alt={userName}
                            fill
                            className="rounded-full object-cover"
                            onError={(e) => {
                              const target =
                                e.currentTarget as HTMLImageElement;
                              target.src = "";
                              target.style.display = "none";
                            }}
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#FEC360] to-amber-500 flex items-center justify-center text-white font-bold text-lg">
                          {userName.charAt(0)}
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">
                          {userName}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {userEmail}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Link
                    href="/dashboard"
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-[#FEC360] hover:bg-amber-50 transition-all duration-200"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    داشبورد مدیریت
                  </Link>

                  <Link
                    href="/profile"
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-[#FEC360] hover:bg-amber-50 transition-all duration-200"
                  >
                    <User className="w-4 h-4" />
                    پروفایل کاربری
                  </Link>

                  <div className="border-t border-gray-100 mt-2 pt-2">
                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 transition-all duration-200 rounded-lg"
                    >
                      <LogOut className="w-4 h-4" />
                      خروج از حساب
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/signin">
                <button
                  type="button"
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm"
                >
                  <User className="w-4 h-4" />
                  ورود
                </button>
              </Link>
            </div>
          )}

          {/* دکمه همبرگری موبایل */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden inline-flex items-center justify-center p-3 rounded-2xl transition-all duration-300 bg-white/10 hover:bg-white/20 text-white"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* منوی موبایل - بهبود یافته */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-gray-900 overflow-y-auto">
          <div className="flex flex-col min-h-full py-4 px-4">
            {/* هدر منوی موبایل */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-25 h-25 relative">
                  <Image
                    src="/images/logo-gold.svg"
                    alt="لوگو خان"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all duration-200"
              >
                <X size={24} />
              </button>
            </div>

            {/* منوی موبایل */}
            <div className="flex-1 space-y-3 mb-6">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 p-4 rounded-xl transition-all duration-300 ${
                      isActive
                        ? "bg-[#FEC360] text-gray-900"
                        : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium text-base">{link.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* بخش کاربر در موبایل */}
            <div className="border-t border-white/20 pt-4">
              {userName ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-white/10 rounded-xl">
                    {/* عکس پروفایل از دیتابیس در موبایل */}
                    {userImage ? (
                      <div className="relative w-10 h-10">
                        <Image
                          src={
                            getImagePath(userImage) ||
                            "/images/placeholder-avatar.jpg"
                          }
                          alt={userName}
                          fill
                          className="rounded-full object-cover"
                          onError={(e) => {
                            const target = e.currentTarget as HTMLImageElement;
                            target.src = "";
                            target.style.display = "none";
                          }}
                        />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#FEC360] to-amber-500 flex items-center justify-center text-white font-bold">
                        {userName.charAt(0)}
                      </div>
                    )}
                    <div className="flex-1 text-right">
                      <p className="text-white font-medium text-sm">{userName}</p>
                      <p className="text-white/70 text-xs">{userEmail}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Link
                      href="/dashboard"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-center gap-2 bg-[#FEC360] text-gray-900 font-semibold py-3 rounded-xl transition-all duration-300 hover:bg-amber-400 text-sm"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      داشبورد
                    </Link>
                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="flex items-center justify-center gap-2 bg-red-600 text-white font-semibold py-3 rounded-xl transition-all duration-300 hover:bg-red-500 text-sm"
                    >
                      <LogOut className="w-4 h-4" />
                      خروج
                    </button>
                  </div>
                </div>
              ) : (
                <Link
                  href="/signin"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-3 w-full bg-[#FEC360] text-gray-900 font-semibold py-4 rounded-xl transition-all duration-300 hover:bg-amber-400"
                >
                  <User className="w-5 h-5" />
                  ورود به حساب کاربری
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;