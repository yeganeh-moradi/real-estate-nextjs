import Link from "next/link";
import { ChevronLeft } from 'lucide-react';

interface HeroSectionProps {
  listingsCount: number;
}

const HeroSection: React.FC<HeroSectionProps> = ({ listingsCount }) => {
  return (
    <section className="text-center w-full mx-auto min-h-[1px] bg-[linear-gradient(to_left,#2ABB9C,#3EB3DA)] pt-3 pb-2 text-white px-4 mt-4">
      <h1 className="text-base mb-2 sm:mb-4 leading-relaxed text-center font-semibold">
        <span className="border-b">
          {listingsCount.toLocaleString('fa-IR') + " "}
        </span>
        آگهی خرید و اجاره املاک در
        <span className="border-b">
          {" "} ۵ {" "}
        </span>
        منطقه تهران
      </h1>

      <p className="mb-4 text-xs font-semibold">
        خان: ملک‌یابی آنلاین، مشاوره بگیر اجاره کن!
      </p>

      <input
        type="text"
        placeholder="جستجوی محله یا نام آگهی…"
        className="w-full mx-auto text-gray-800 placeholder-gray-500 focus:outline-none rounded-xl py-2 px-4 mb-4 bg-white"
      />

      <Link
        href="/listings"
        className="inline-block bg-[#FEC360] text-black px-6 py-2 rounded-xl hover:bg-[#FED58F] transition w-full font-semibold"
      >
        جستجو در املاک
      </Link>

      <Link
        href="/listings"
        className="inline-block mt-2 text-xs font-semibold"
      >
        مشاهده همه آگهی‌های فعال
        <ChevronLeft className="inline-block" />
      </Link>
    </section>
  );
}

export default HeroSection;
