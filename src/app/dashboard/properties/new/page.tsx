"use client";

import { useState, FormEvent, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { 
  Upload, 
  X, 
  Home, 
  MapPin, 
  DollarSign, 
  Ruler, 
  Bed, 
  Bath, 
  Building, 
  Calendar,
  Car,
  Square,
  Warehouse,
  Sofa,
  ArrowLeft,
  Loader2
} from "lucide-react";
import Link from "next/link";

// تایپ فرم ملک مطابق مدل Prisma
interface PropertyForm {
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
}

interface UploadedFile {
    fileName: string;
    originalName: string;
    url: string;
}

export default function NewPropertyPage() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState<PropertyForm>({
        title: "",
        description: "",
        propertyType: "",
        dealType: "",
        price: null,
        rentPrice: null,
        depositPrice: null,
        area: 0,
        roomCount: null,
        bathroomCount: null,
        floor: null,
        totalFloors: null,
        yearBuilt: null,
        parking: false,
        elevator: false,
        storage: false,
        furnished: false,
        status: "فعال",
        location: "",
        images: [],
        ownerId: 1,
    });

    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

    // آپلود فایل‌ها
    const handleFileUpload = async (files: FileList) => {
        setUploading(true);
        setError(null);

        try {
            const uploadPromises = Array.from(files).map(async (file) => {
                if (!file.type.startsWith('image/')) {
                    throw new Error(`فایل ${file.name} باید یک تصویر باشد`);
                }

                if (file.size > 5 * 1024 * 1024) {
                    throw new Error(`حجم فایل ${file.name} نباید بیشتر از 5MB باشد`);
                }

                const formData = new FormData();
                formData.append('file', file);

                const res = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                });

                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.error || `خطا در آپلود ${file.name}`);
                }

                const data = await res.json();

                return {
                    fileName: data.fileName,
                    originalName: file.name,
                    url: `/images/${data.fileName}`
                };
            });

            const results = await Promise.all(uploadPromises);
            const newFileNames = results.map(result => result.fileName);

            setFormData(prev => ({
                ...prev,
                images: [...prev.images, ...newFileNames]
            }));

            setUploadedFiles(prev => [...prev, ...results]);
            setSuccess(`${results.length} فایل با موفقیت آپلود شد`);

        } catch (err: any) {
            setError(err.message);
        } finally {
            setUploading(false);
        }
    };

    // حذف عکس آپلود شده
    const removeImage = useCallback((index: number) => {
        const newImages = [...formData.images];
        const newUploadedFiles = [...uploadedFiles];

        newImages.splice(index, 1);
        newUploadedFiles.splice(index, 1);

        setFormData(prev => ({ ...prev, images: newImages }));
        setUploadedFiles(newUploadedFiles);
    }, [formData.images, uploadedFiles]);

    // ذخیره ملک جدید
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        // اعتبارسنجی اولیه
        if (!formData.title || !formData.propertyType || !formData.dealType) {
            setError("پر کردن فیلدهای الزامی (عنوان، نوع ملک و نوع معامله) ضروری است");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/properties", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "خطا در ایجاد ملک جدید");
            }

            setSuccess("ملک جدید با موفقیت ایجاد شد");
            setTimeout(() => {
                router.push("/dashboard/properties");
                router.refresh();
            }, 1500);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field: keyof PropertyForm, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleNumberChange = (field: keyof PropertyForm, value: string) => {
        handleChange(field, value === "" ? null : parseFloat(value));
    };

    const handleIntChange = (field: keyof PropertyForm, value: string) => {
        handleChange(field, value === "" ? null : parseInt(value));
    };

    // تابع جدید برای مدیریت قیمت‌ها
    const handlePriceChange = (field: keyof PropertyForm, value: string) => {
        // حذف کاراکترهای غیرعددی به جز نقطه و کاما
        const numericValue = value.replace(/[^\d,]/g, '');
        
        if (numericValue === '') {
            handleChange(field, null);
            return;
        }

        // تبدیل به عدد
        const numberValue = parseInt(numericValue.replace(/,/g, ''));
        
        if (!isNaN(numberValue)) {
            handleChange(field, numberValue);
        }
    };

    // تابع جدید برای فرمت قیمت
    const formatPrice = (price: number | null) => {
        if (!price) return "";
        return new Intl.NumberFormat('fa-IR').format(price);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* هدر */}
            <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200/60 sticky top-0 z-10">
                <div className="max-w-6xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link
                                href="/dashboard/properties"
                                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-all duration-300 hover:bg-gray-100 p-2 rounded-xl"
                            >
                                <ArrowLeft className="w-5 h-5" />
                                <span className="hidden sm:inline">بازگشت</span>
                            </Link>
                            <div className="h-6 w-0.5 bg-gray-300 hidden sm:block"></div>
                            <h1 className="text-2xl font-bold text-gray-900 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                                ایجاد ملک جدید
                            </h1>
                        </div>
                        <div className="flex items-center gap-3">
                            <Home className="w-6 h-6 text-[#FEC360]" />
                        </div>
                    </div>
                </div>
            </header>

            {/* محتوای اصلی */}
            <main className="max-w-4xl mx-auto px-4 py-8">
                {/* پیام‌ها */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3">
                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                            <X className="w-4 h-4 text-red-600" />
                        </div>
                        <p className="text-red-700 font-medium">{error}</p>
                    </div>
                )}

                {success && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-2xl flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                        </div>
                        <p className="text-green-700 font-medium">{success}</p>
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
                >
                    {/* اطلاعات اصلی */}
                    <div className="mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Home className="w-4 h-4 text-blue-600" />
                            </div>
                            اطلاعات اصلی ملک
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* عنوان */}
                            <div className="group">
                                <label className="block mb-3 text-sm font-medium text-gray-700">
                                    عنوان ملک *
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => handleChange("title", e.target.value)}
                                        className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FEC360] focus:border-transparent transition group-hover:border-gray-400"
                                        placeholder="عنوان جذاب برای ملک"
                                        required
                                    />
                                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                        <Home className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>

                            {/* موقعیت */}
                            <div className="group">
                                <label className="block mb-3 text-sm font-medium text-gray-700">
                                    موقعیت مکانی *
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={formData.location}
                                        onChange={(e) => handleChange("location", e.target.value)}
                                        className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FEC360] focus:border-transparent transition group-hover:border-gray-400"
                                        placeholder="آدرس یا منطقه"
                                        required
                                    />
                                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                        <MapPin className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* توضیحات */}
                        <div className="mt-6 group">
                            <label className="block mb-3 text-sm font-medium text-gray-700">
                                توضیحات *
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => handleChange("description", e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FEC360] focus:border-transparent transition resize-none group-hover:border-gray-400 min-h-[120px]"
                                placeholder="توضیحات کامل درباره ملک، امکانات و ویژگی‌های خاص..."
                                required
                            />
                        </div>
                    </div>

                    {/* نوع ملک و معامله */}
                    <div className="mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                <Building className="w-4 h-4 text-green-600" />
                            </div>
                            نوع ملک و معامله
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="group">
                                <label className="block mb-3 text-sm font-medium text-gray-700">
                                    نوع ملک *
                                </label>
                                <select
                                    value={formData.propertyType}
                                    onChange={(e) => handleChange("propertyType", e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FEC360] focus:border-transparent transition group-hover:border-gray-400 appearance-none bg-white"
                                    required
                                >
                                    <option value="">انتخاب نوع ملک</option>
                                    <option value="آپارتمان">آپارتمان</option>
                                    <option value="ویلا">ویلا</option>
                                    <option value="دفتر کار">دفتر کار</option>
                                    <option value="مغازه">مغازه</option>
                                    <option value="زمین">زمین</option>
                                    <option value="خانه ویلایی">خانه ویلایی</option>
                                </select>
                            </div>

                            <div className="group">
                                <label className="block mb-3 text-sm font-medium text-gray-700">
                                    نوع معامله *
                                </label>
                                <select
                                    value={formData.dealType}
                                    onChange={(e) => handleChange("dealType", e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FEC360] focus:border-transparent transition group-hover:border-gray-400 appearance-none bg-white"
                                    required
                                >
                                    <option value="">انتخاب نوع معامله</option>
                                    <option value="فروش">فروش</option>
                                    <option value="اجاره">اجاره</option>
                                    <option value="پیش فروش">پیش فروش</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* قیمت‌ها */}
                    <div className="mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                            <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                                <DollarSign className="w-4 h-4 text-amber-600" />
                            </div>
                            اطلاعات مالی
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="group">
                                <label className="block mb-3 text-sm font-medium text-gray-700">
                                    قیمت فروش (تومان)
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={formatPrice(formData.price)}
                                        onChange={(e) => handlePriceChange("price", e.target.value)}
                                        className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FEC360] focus:border-transparent transition group-hover:border-gray-400 text-left"
                                        placeholder="قیمت فروش"
                                    />
                                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                        <DollarSign className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>

                            <div className="group">
                                <label className="block mb-3 text-sm font-medium text-gray-700">
                                    ودیعه (تومان)
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={formatPrice(formData.depositPrice)}
                                        onChange={(e) => handlePriceChange("depositPrice", e.target.value)}
                                        className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FEC360] focus:border-transparent transition group-hover:border-gray-400 text-left"
                                        placeholder="مبلغ ودیعه"
                                    />
                                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                        <DollarSign className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>

                            <div className="group">
                                <label className="block mb-3 text-sm font-medium text-gray-700">
                                    اجاره (تومان)
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={formatPrice(formData.rentPrice)}
                                        onChange={(e) => handlePriceChange("rentPrice", e.target.value)}
                                        className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FEC360] focus:border-transparent transition group-hover:border-gray-400 text-left"
                                        placeholder="مبلغ اجاره"
                                    />
                                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                        <DollarSign className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* مشخصات فنی */}
                    <div className="mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                <Ruler className="w-4 h-4 text-purple-600" />
                            </div>
                            مشخصات فنی
                        </h2>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div className="group">
                                <label className="block mb-3 text-sm font-medium text-gray-700">
                                    مساحت (متر)
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={formData.area}
                                        onChange={(e) => handleNumberChange("area", e.target.value)}
                                        className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FEC360] focus:border-transparent transition group-hover:border-gray-400"
                                    />
                                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                        <Ruler className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>

                            <div className="group">
                                <label className="block mb-3 text-sm font-medium text-gray-700">
                                    تعداد اتاق
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={formData.roomCount || ""}
                                        onChange={(e) => handleIntChange("roomCount", e.target.value)}
                                        className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FEC360] focus:border-transparent transition group-hover:border-gray-400"
                                    />
                                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                        <Bed className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>

                            <div className="group">
                                <label className="block mb-3 text-sm font-medium text-gray-700">
                                    تعداد حمام
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={formData.bathroomCount || ""}
                                        onChange={(e) => handleIntChange("bathroomCount", e.target.value)}
                                        className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FEC360] focus:border-transparent transition group-hover:border-gray-400"
                                    />
                                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                        <Bath className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>

                            <div className="group">
                                <label className="block mb-3 text-sm font-medium text-gray-700">
                                    سال ساخت
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={formData.yearBuilt || ""}
                                        onChange={(e) => handleIntChange("yearBuilt", e.target.value)}
                                        className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FEC360] focus:border-transparent transition group-hover:border-gray-400"
                                    />
                                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                        <Calendar className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* طبقه و تعداد طبقات */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                            <div className="group">
                                <label className="block mb-3 text-sm font-medium text-gray-700">
                                    طبقه
                                </label>
                                <input
                                    type="number"
                                    value={formData.floor || ""}
                                    onChange={(e) => handleIntChange("floor", e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FEC360] focus:border-transparent transition group-hover:border-gray-400"
                                />
                            </div>

                            <div className="group">
                                <label className="block mb-3 text-sm font-medium text-gray-700">
                                    تعداد کل طبقات
                                </label>
                                <input
                                    type="number"
                                    value={formData.totalFloors || ""}
                                    onChange={(e) => handleIntChange("totalFloors", e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FEC360] focus:border-transparent transition group-hover:border-gray-400"
                                />
                            </div>
                        </div>
                    </div>

                    {/* امکانات */}
                    <div className="mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                            <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                                <Square className="w-4 h-4 text-indigo-600" />
                            </div>
                            امکانات
                        </h2>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:border-[#FEC360] transition cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={formData.parking}
                                    onChange={(e) => handleChange("parking", e.target.checked)}
                                    className="w-4 h-4 text-[#FEC360] focus:ring-[#FEC360] rounded"
                                />
                                <Car className="w-5 h-5 text-gray-400 group-hover:text-[#FEC360]" />
                                <span className="text-gray-700">پارکینگ</span>
                            </label>

                            <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:border-[#FEC360] transition cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={formData.elevator}
                                    onChange={(e) => handleChange("elevator", e.target.checked)}
                                    className="w-4 h-4 text-[#FEC360] focus:ring-[#FEC360] rounded"
                                />
                                <Building className="w-5 h-5 text-gray-400 group-hover:text-[#FEC360]" />
                                <span className="text-gray-700">آسانسور</span>
                            </label>

                            <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:border-[#FEC360] transition cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={formData.storage}
                                    onChange={(e) => handleChange("storage", e.target.checked)}
                                    className="w-4 h-4 text-[#FEC360] focus:ring-[#FEC360] rounded"
                                />
                                <Warehouse className="w-5 h-5 text-gray-400 group-hover:text-[#FEC360]" />
                                <span className="text-gray-700">انباری</span>
                            </label>

                            <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:border-[#FEC360] transition cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={formData.furnished}
                                    onChange={(e) => handleChange("furnished", e.target.checked)}
                                    className="w-4 h-4 text-[#FEC360] focus:ring-[#FEC360] rounded"
                                />
                                <Sofa className="w-5 h-5 text-gray-400 group-hover:text-[#FEC360]" />
                                <span className="text-gray-700">مبله</span>
                            </label>
                        </div>
                    </div>

                    {/* آپلود تصاویر */}
                    <div className="mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                            <div className="w-8 h-8 bg-rose-100 rounded-lg flex items-center justify-center">
                                <Upload className="w-4 h-4 text-rose-600" />
                            </div>
                            گالری تصاویر
                        </h2>

                        {/* دکمه آپلود */}
                        <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center mb-6 transition hover:border-[#FEC360] hover:bg-amber-50/50">
                            <input
                                type="file"
                                ref={fileInputRef}
                                multiple
                                accept="image/*"
                                onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                                className="hidden"
                            />

                            <div className="flex flex-col items-center justify-center gap-4">
                                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
                                    {uploading ? (
                                        <Loader2 className="w-6 h-6 text-amber-600 animate-spin" />
                                    ) : (
                                        <Upload className="w-6 h-6 text-amber-600" />
                                    )}
                                </div>
                                <div>
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={uploading}
                                        className="bg-gradient-to-r from-[#FEC360] to-amber-500 text-gray-900 px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {uploading ? "در حال آپلود..." : "انتخاب تصاویر"}
                                    </button>
                                    <p className="text-sm text-gray-500 mt-3">
                                        فرمت‌های مجاز: JPG, PNG, GIF • حداکثر حجم: 5MB
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* پیش‌نمایش تصاویر آپلود شده */}
                        {uploadedFiles.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                {uploadedFiles.map((file, index) => (
                                    <div key={index} className="relative group">
                                        <div className="aspect-square rounded-xl overflow-hidden border border-gray-200 group-hover:border-[#FEC360] transition">
                                            <img
                                                src={file.url}
                                                alt={file.originalName}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                        <p className="text-xs text-gray-600 truncate mt-2 text-center">
                                            {file.originalName}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* دکمه‌ها */}
                    <div className="flex gap-4 pt-8 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={() => router.push("/dashboard/properties")}
                            className="flex-1 flex items-center justify-center gap-2 bg-gray-500 text-white px-6 py-4 rounded-xl font-semibold hover:bg-gray-600 transition"
                        >
                            <X className="w-5 h-5" />
                            انصراف
                        </button>

                        <button
                            type="submit"
                            disabled={loading || uploading}
                            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-[#FEC360] to-amber-500 text-gray-900 px-6 py-4 rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    در حال ایجاد ملک...
                                </>
                            ) : (
                                <>
                                    <Home className="w-5 h-5" />
                                    ایجاد ملک جدید
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
}