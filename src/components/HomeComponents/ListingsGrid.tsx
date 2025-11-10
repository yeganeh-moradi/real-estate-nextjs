import Image from "next/image";
import Link from "next/link";
import { Eye, MapPin } from "lucide-react";

interface Listing {
  id: number | string;
  title: string;
  description: string;
  price: number | null;
  images: string[];
  location?: string;
}

interface ListingsGridProps {
  listings: Listing[];
}

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

const ListingsGrid: React.FC<ListingsGridProps> = ({ listings }) => {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full px-4 pb-4">
      {listings.map((listing) => (
        <div
          key={listing.id}
          className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col group"
        >
          {/* تصویر ملک */}
          <div className="relative h-64 w-full overflow-hidden">
            <Image
              src={getImagePath(listing.images[0]) || "/images/placeholder-avatar.jpg"}
              alt={listing.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />

            {/* Overlay گرادینت */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* قیمت */}
            {listing.price && (
              <div className="absolute top-4 left-4">
                <span className="bg-[#FEC360] text-gray-900 px-3 py-2 rounded-xl font-bold text-sm shadow-lg">
                  {listing.price.toLocaleString("fa-IR")} تومان
                </span>
              </div>
            )}
          </div>

          {/* محتوای کارت */}
          <div className="p-6 flex flex-col flex-grow">
            {/* عنوان و لوکیشن */}
            <div className="mb-4">
              <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-[#FEC360] transition-colors duration-200">
                {listing.title}
              </h3>

              {listing.location && (
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <MapPin className="w-4 h-4" />
                  <span>{listing.location}</span>
                </div>
              )}
            </div>

            {/* توضیحات */}
            <p className="text-gray-600 text-sm leading-6 flex-grow mb-6 line-clamp-3">
              {listing.description}
            </p>

            {/* دکمه جزئیات */}
            <div className="mt-auto">
              <Link
                href={`/properties/${String(listing.id)}`}
                className="w-full bg-gray-800 hover:bg-gray-900 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 group/btn"
              >
                <Eye className="w-4 h-4 transition-transform group-hover/btn:scale-110" />
                مشاهده جزئیات
              </Link>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
};

export default ListingsGrid;
