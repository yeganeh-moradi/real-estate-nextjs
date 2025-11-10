export const runtime = "nodejs";
export const dynamic = "force-dynamic";


import prisma from "@/lib/prisma";
import HeroSection from "@/components/HomeComponents/HeroSection";
import ListingsGrid from "@/components/HomeComponents/ListingsGrid";
import { JSX } from "react";
import { House, Plus } from "lucide-react";
import Link from "next/link";

interface Listing {
    id: number; // فقط number چون در Prisma Int است
    title: string;
    description: string;
    price: number | null;
    images: string[];
    location: string; // اجباری چون در Prisma اجباری است
    propertyType?: string;
    dealType?: string;
    rentPrice?: number | null;
    depositPrice?: number | null;
    area?: number;
    roomCount?: number | null;
    bathroomCount?: number | null;
    floor?: number | null;
    totalFloors?: number | null;
    yearBuilt?: number | null;
    parking?: boolean;
    elevator?: boolean;
    storage?: boolean;
    furnished?: boolean;
    status?: string;
    ownerId?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export default async function Home(): Promise<JSX.Element> {
    let listings: Listing[] = [];

    try {
        listings = await prisma.property.findMany({
            orderBy: { createdAt: "desc" }
        });
    } catch (error) {
        console.error("Error fetching posts:", error);
        // در صورت خطا، posts به صورت آرایه خالی باقی می‌ماند
    }

    return (
        <>
            {/* استفاده از HeroSection */}
            <HeroSection listingsCount={listings.length} />

            {/* نمایش لیست املاک یا پیام خالی */}
            {listings.length > 0 ? (
                <ListingsGrid listings={listings} />
            ) : (
                <section className="max-w-6xl mx-auto px-4 py-20 bg-white">
                    <div className="text-center">
                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-12 max-w-2xl mx-auto border border-gray-200 shadow-lg">
                            {/* آیکون */}
                            <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-[#FEC360]/10 flex items-center justify-center">
                                <House className="w-12 h-12 text-[#FEC360]" />
                            </div>

                            {/* متن */}
                            <h2 className="text-3xl font-bold text-gray-800 mb-4">
                                ملکی ثبت نشده است
                            </h2>

                            <p className="text-gray-600 text-lg mb-8 leading-8 max-w-md mx-auto">
                                در حال حاضر هیچ ملکی در سیستم ثبت نشده است.
                                شما می‌توانید اولین ملک را ثبت کنید تا در لیست نمایش داده شود.
                            </p>

                            {/* آمار */}
                            <div className="bg-white rounded-xl p-6 mb-8 border border-gray-200 shadow-sm">
                                <div className="grid grid-cols-2 gap-4 text-center">
                                    <div>
                                        <div className="text-2xl font-bold text-[#FEC360]">0</div>
                                        <div className="text-sm text-gray-500">ملک ثبت شده</div>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-gray-400">0</div>
                                        <div className="text-sm text-gray-500">ملک فعال</div>
                                    </div>
                                </div>
                            </div>

                            {/* دکمه‌های اقدام */}
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link
                                    href="/dashboard"
                                    className="inline-flex items-center gap-3 bg-[#FEC360] text-gray-900 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-[#fed27a] transition-all duration-300 shadow-lg hover:shadow-xl"
                                >
                                    <Plus className="w-5 h-5" />
                                    ثبت اولین ملک
                                </Link>


                            </div>

                            {/* نکات مهم */}
                            <div className="mt-10 pt-8 border-t border-gray-200">
                                <h4 className="font-semibold text-gray-700 mb-4">مزایای ثبت ملک</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-[#FEC360] rounded-full"></div>
                                        <span>دسترسی بیشتر کاربران</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-[#FEC360] rounded-full"></div>
                                        <span>نمایش در نتایج جستجو</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-[#FEC360] rounded-full"></div>
                                        <span>مدیریت آسان اطلاعات</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}
        </>
    );
}