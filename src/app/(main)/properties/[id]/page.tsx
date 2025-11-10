import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  MapPin,
  Home,
  Ruler,
  Bed,
  Bath,
  Car,
  Building,
  Warehouse,
  Sofa,
} from "lucide-react";
import prisma from "@/lib/prisma";

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

export default async function ListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  let listing = null;
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

    listing = await prisma.property.findUnique({
      where: { id: parsedId },
      include: {
        owner: {
          select: { name: true, email: true },
        },
      },
    });
  } catch (err) {
    console.error("Error fetching listing:", err);
    error = "خطا در بارگذاری اطلاعات";
  }

  if (error) {
    return (
      <main className="flex flex-col items-center justify-center min-h-[60vh] text-red-600 font-semibold">
        {error}
      </main>
    );
  }

  if (!listing) {
    return (
      <main className="flex flex-col items-center justify-center min-h-[60vh] text-gray-600 font-semibold">
        ملکی با این شناسه پیدا نشد.
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* 🔹 دکمه بازگشت */}
        <Link
          href="/listings"
          className="inline-flex items-center gap-2 text-gray-700 hover:text-[#FEC360] transition-colors duration-200 mb-8 group"
        >
          <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>بازگشت به لیست آگهی‌ها</span>
        </Link>

        {/* 🔹 کارت اصلی ملک */}
        <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-xl overflow-hidden">
          {/* 🔹 تصویر اصلی ملک */}
          {listing.images && listing.images.length > 0 ? (
            <div className="relative w-full h-80 sm:h-96 overflow-hidden">
              <Image
                src={
                  getImagePath(listing.images[0]) ||
                  "/images/placeholder-avatar.jpg"
                }
                alt={listing.title || "ملک"}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
              />
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          ) : (
            <div className="w-full h-80 sm:h-96 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <span className="text-gray-400 text-lg">بدون تصویر</span>
            </div>
          )}

          {/* 🔹 محتوای ملک */}
          <div className="p-8">
            {/* هدر ملک */}
            <div className="mb-6">
              {listing.propertyType && (
                <span className="inline-block bg-[#FEC360]/20 text-gray-800 px-4 py-2 rounded-full text-sm font-medium mb-4 border border-[#FEC360]/30">
                  {listing.propertyType}
                </span>
              )}
              <h1 className="text-3xl font-extrabold text-gray-800 leading-tight mb-4">
                {listing.title || "بدون عنوان"}
              </h1>

              <p className="text-gray-600 text-lg leading-8 mb-6">
                {listing.description || "بدون توضیحات"}
              </p>
            </div>

            {/* 🔹 جزئیات ملک */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <Home className="w-5 h-5 text-[#FEC360]" />
                <div>
                  <p className="text-sm text-gray-500">نوع ملک</p>
                  <p className="font-semibold text-gray-800">
                    {listing.propertyType || "-"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <MapPin className="w-5 h-5 text-[#FEC360]" />
                <div>
                  <p className="text-sm text-gray-500">نوع معامله</p>
                  <p className="font-semibold text-gray-800">
                    {listing.dealType || "-"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <Ruler className="w-5 h-5 text-[#FEC360]" />
                <div>
                  <p className="text-sm text-gray-500">متراژ</p>
                  <p className="font-semibold text-gray-800">
                    {listing.area ? `${listing.area} متر` : "-"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <Bed className="w-5 h-5 text-[#FEC360]" />
                <div>
                  <p className="text-sm text-gray-500">تعداد اتاق</p>
                  <p className="font-semibold text-gray-800">
                    {listing.roomCount ?? "-"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <Bath className="w-5 h-5 text-[#FEC360]" />
                <div>
                  <p className="text-sm text-gray-500">تعداد سرویس</p>
                  <p className="font-semibold text-gray-800">
                    {listing.bathroomCount ?? "-"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <Building className="w-5 h-5 text-[#FEC360]" />
                <div>
                  <p className="text-sm text-gray-500">طبقه</p>
                  <p className="font-semibold text-gray-800">
                    {listing.floor ?? "-"}
                  </p>
                </div>
              </div>
            </div>

            {/* 🔹 امکانات */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                امکانات
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {listing.parking && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <Car className="w-4 h-4 text-[#FEC360]" />
                    <span>پارکینگ</span>
                  </div>
                )}
                {listing.elevator && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <Building className="w-4 h-4 text-[#FEC360]" />
                    <span>آسانسور</span>
                  </div>
                )}
                {listing.storage && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <Warehouse className="w-4 h-4 text-[#FEC360]" />
                    <span>انباری</span>
                  </div>
                )}
                {listing.furnished && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <Sofa className="w-4 h-4 text-[#FEC360]" />
                    <span>مبله</span>
                  </div>
                )}
                {!listing.parking &&
                  !listing.elevator &&
                  !listing.storage &&
                  !listing.furnished && (
                    <div className="text-gray-400">
                      امکانات خاصی ثبت نشده است.
                    </div>
                  )}
              </div>
            </div>

            {/* 🔹 قیمت */}
            <div className="mb-8 p-6 bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl text-white">
              <h2 className="text-xl font-bold mb-4">قیمت</h2>
              {listing.dealType === "فروش" && listing.price && (
                <p className="text-2xl font-bold text-[#FEC360]">
                  {listing.price.toLocaleString("fa-IR")} تومان
                </p>
              )}
              {listing.dealType === "اجاره" && (
                <div className="space-y-2">
                  <p className="text-lg">
                    <span className="text-gray-300">رهن:</span>{" "}
                    <span className="font-bold text-[#FEC360]">
                      {listing.depositPrice?.toLocaleString("fa-IR") ?? "-"}{" "}
                      تومان
                    </span>
                  </p>
                  <p className="text-lg">
                    <span className="text-gray-300">اجاره:</span>{" "}
                    <span className="font-bold text-[#FEC360]">
                      {listing.rentPrice?.toLocaleString("fa-IR") ?? "-"} تومان
                    </span>
                  </p>
                </div>
              )}
              {listing.dealType === "رهن کامل" && listing.depositPrice && (
                <p className="text-2xl font-bold text-[#FEC360]">
                  رهن کامل: {listing.depositPrice.toLocaleString("fa-IR")} تومان
                </p>
              )}
            </div>

            {/* 🔹 اطلاعات مالک */}
            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                مشخصات مالک
              </h2>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-gray-600">
                <div>
                  <p className="font-semibold">
                    {listing.owner?.name || "نامشخص"}
                  </p>
                  {listing.owner?.email && (
                    <p className="text-gray-500 text-sm mt-1">
                      {listing.owner.email}
                    </p>
                  )}
                </div>
                <div className="text-sm text-gray-500">
                  ثبت شده در{" "}
                  {new Date(listing.createdAt).toLocaleDateString("fa-IR")}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 🔹 دکمه بازگشت پایین */}
        <div className="mt-8 text-center">
          <Link
            href="/listings"
            className="inline-flex items-center gap-2 bg-gray-800 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-900 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <ChevronLeft className="w-4 h-4" />
            بازگشت به لیست املاک
          </Link>
        </div>
      </div>
    </main>
  );
}
