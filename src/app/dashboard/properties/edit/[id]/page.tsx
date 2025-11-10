"use client";

import { use, useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";

// تعریف تایپ برای Property مطابق مدل Prisma
interface Property {
    id: number;
    title: string;
    description: string;
    propertyType: string;
    dealType: string;
    price: number | null;
    rentPrice: number | null;
    depositPrice: number | null;
    area: number;
    roomCount: number | null;
    bathroomCount: number | null;
    floor: number | null;
    totalFloors: number | null;
    yearBuilt: number | null;
    parking: boolean;
    elevator: boolean;
    storage: boolean;
    furnished: boolean;
    status: string;
    location: string;
    images: string[];
    ownerId: number;
    createdAt: string;
    updatedAt: string;
}

export default function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();

    const [property, setProperty] = useState<Property | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // دریافت اطلاعات ملک از API
    useEffect(() => {
        const fetchProperty = async () => {
            try {
                console.log("Fetching property with ID:", id);
                const res = await fetch(`/api/properties/${id}`);

                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.error || "خطا در دریافت اطلاعات ملک");
                }

                const data = await res.json();
                setProperty(data);
            } catch (err: any) {
                console.error("Error fetching property:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProperty();
        }
    }, [id]);

    // ذخیره تغییرات
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!property) return;

        setSaving(true);
        setError(null);

        try {
            const res = await fetch(`/api/properties/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(property),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "خطا در ذخیره تغییرات");
            }

            router.push("/dashboard/properties");
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (field: keyof Property, value: any) => {
        if (!property) return;
        setProperty(prev => prev ? { ...prev, [field]: value } : null);
    };

    const handleNumberChange = (field: keyof Property, value: string) => {
        handleChange(field, value === "" ? null : parseFloat(value));
    };

    const handleIntChange = (field: keyof Property, value: string) => {
        handleChange(field, value === "" ? null : parseInt(value));
    };

    const handleArrayChange = (value: string) => {
        if (!property) return;
        // تبدیل رشته به آرایه (فرض بر این که تصاویر با کاما جدا شده‌اند)
        const imagesArray = value.split(',').map(img => img.trim()).filter(img => img !== '');
        setProperty(prev => prev ? { ...prev, images: imagesArray } : null);
    };

    if (loading) return <div className="p-10 text-gray-600">در حال بارگذاری...</div>;
    if (error) return <div className="p-10 text-red-600">خطا: {error}</div>;
    if (!property) return <div className="p-10">ملک یافت نشد.</div>;

    return (
        <div className="max-w-4xl mx-auto p-8">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">ویرایش ملک</h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-xl p-6 space-y-6">
                {/* اطلاعات اصلی */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-2 text-gray-700">عنوان ملک *</label>
                        <input
                            type="text"
                            value={property.title}
                            onChange={(e) => handleChange("title", e.target.value)}
                            className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-2 text-gray-700">موقعیت *</label>
                        <input
                            type="text"
                            value={property.location}
                            onChange={(e) => handleChange("location", e.target.value)}
                            className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                </div>

                {/* توضیحات */}
                <div>
                    <label className="block mb-2 text-gray-700">توضیحات *</label>
                    <textarea
                        value={property.description}
                        onChange={(e) => handleChange("description", e.target.value)}
                        className="border rounded-lg px-3 py-2 w-full min-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                {/* نوع ملک و معامله */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-2 text-gray-700">نوع ملک *</label>
                        <select
                            value={property.propertyType}
                            onChange={(e) => handleChange("propertyType", e.target.value)}
                            className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            <option value="">انتخاب کنید</option>
                            <option value="apartment">آپارتمان</option>
                            <option value="villa">ویلا</option>
                            <option value="office">دفتر کار</option>
                            <option value="shop">مغازه</option>
                            <option value="land">زمین</option>
                        </select>
                    </div>

                    <div>
                        <label className="block mb-2 text-gray-700">نوع معامله *</label>
                        <select
                            value={property.dealType}
                            onChange={(e) => handleChange("dealType", e.target.value)}
                            className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            <option value="">انتخاب کنید</option>
                            <option value="sale">فروش</option>
                            <option value="rent">اجاره</option>
                        </select>
                    </div>
                </div>

                {/* قیمت‌ها */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block mb-2 text-gray-700">قیمت (تومان)</label>
                        <input
                            type="number"
                            value={property.price || ""}
                            onChange={(e) => handleNumberChange("price", e.target.value)}
                            className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-gray-700">ودیعه (تومان)</label>
                        <input
                            type="number"
                            value={property.depositPrice || ""}
                            onChange={(e) => handleNumberChange("depositPrice", e.target.value)}
                            className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-gray-700">اجاره (تومان)</label>
                        <input
                            type="number"
                            value={property.rentPrice || ""}
                            onChange={(e) => handleNumberChange("rentPrice", e.target.value)}
                            className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {/* مشخصات فنی */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block mb-2 text-gray-700">مساحت (متر مربع) *</label>
                        <input
                            type="number"
                            step="0.1"
                            value={property.area}
                            onChange={(e) => handleNumberChange("area", e.target.value)}
                            className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-gray-700">تعداد اتاق</label>
                        <input
                            type="number"
                            value={property.roomCount || ""}
                            onChange={(e) => handleIntChange("roomCount", e.target.value)}
                            className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-gray-700">تعداد حمام</label>
                        <input
                            type="number"
                            value={property.bathroomCount || ""}
                            onChange={(e) => handleIntChange("bathroomCount", e.target.value)}
                            className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-gray-700">طبقه</label>
                        <input
                            type="number"
                            value={property.floor || ""}
                            onChange={(e) => handleIntChange("floor", e.target.value)}
                            className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {/* اطلاعات ساختمان */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block mb-2 text-gray-700">تعداد کل طبقات</label>
                        <input
                            type="number"
                            value={property.totalFloors || ""}
                            onChange={(e) => handleIntChange("totalFloors", e.target.value)}
                            className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-gray-700">سال ساخت</label>
                        <input
                            type="number"
                            min="1300"
                            max="1403"
                            value={property.yearBuilt || ""}
                            onChange={(e) => handleIntChange("yearBuilt", e.target.value)}
                            className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-gray-700">وضعیت *</label>
                        <select
                            value={property.status}
                            onChange={(e) => handleChange("status", e.target.value)}
                            className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            <option value="">انتخاب کنید</option>
                            <option value="active">فعال</option>
                            <option value="inactive">غیرفعال</option>
                            <option value="sold">فروخته شده</option>
                            <option value="rented">اجاره داده شده</option>
                        </select>
                    </div>
                </div>

                {/* امکانات */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={property.parking}
                            onChange={(e) => handleChange("parking", e.target.checked)}
                            className="w-4 h-4"
                        />
                        پارکینگ
                    </label>
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={property.elevator}
                            onChange={(e) => handleChange("elevator", e.target.checked)}
                            className="w-4 h-4"
                        />
                        آسانسور
                    </label>
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={property.storage}
                            onChange={(e) => handleChange("storage", e.target.checked)}
                            className="w-4 h-4"
                        />
                        انباری
                    </label>
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={property.furnished}
                            onChange={(e) => handleChange("furnished", e.target.checked)}
                            className="w-4 h-4"
                        />
                        مبله
                    </label>
                </div>

                {/* تصاویر */}
                <div>
                    <label className="block mb-2 text-gray-700">آدرس تصاویر (با کاما جدا کنید)</label>
                    <textarea
                        value={property.images.join(', ')}
                        onChange={(e) => handleArrayChange(e.target.value)}
                        className="border rounded-lg px-3 py-2 w-full min-h-[80px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                    />
                    <p className="text-sm text-gray-500 mt-1">آدرس تصاویر را با کاما از هم جدا کنید</p>
                </div>

                {/* دکمه‌ها */}
                <div className="flex gap-3 pt-6 border-t">
                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex-1"
                    >
                        {saving ? "در حال ذخیره..." : "ذخیره تغییرات"}
                    </button>
                    <button
                        type="button"
                        onClick={() => router.push("/dashboard/properties")}
                        className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition flex-1"
                    >
                        انصراف
                    </button>
                </div>
            </form>
        </div>
    );
}