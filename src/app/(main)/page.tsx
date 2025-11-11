import prisma from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import {
  PlayCircle,
  Home,
  Video,
  FileText,
  Users,
  ArrowLeft,
  RefreshCw,
  Star,
  Award,
  Shield,
  Heart,
  Building,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Eye,
  MessageCircle,
} from "lucide-react";
import EmblaSlider from "@/components/HomeComponents/EmblaSlider";
import { JSX } from "react";

interface Post {
  id: number;
  title: string;
  content: string | null;
  imageUrl: string | null;
  videoUrl: string | null;
  embedCode: string | null;
  category: string | null;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
  authorId: number | null;
  author?: {
    id: number;
    name: string | null;
    image: string | null;
    bio: string | null;
  } | null;
}

// اطلاعات شخصی صاحب سایت
const siteOwner = {
  name: "محراب احمدی",
  title: "مشاور املاک و سرمایه‌گذاری مسکن",
  bio: "با بیش از ۱۰ سال تجربه در زمینه مشاوره املاک، سرمایه‌گذاری مسکن و مدیریت پروژه‌های ساختمانی. متخصص در حوزه املاک لوکس و سرمایه‌گذاری مطمئن در مسکن.",
  image: "/images/ahmadi-pic.jpg",
  phone: "09020079101",
  email: "Mehrabahmadifabilsara@gmail.com",
  experience: "۱۰+ سال",
  satisfiedClients: "۵۰۰+",
  successfulDeals: "۱۲۰۰+",
  specialties: [
    "املاک لوکس",
    "سرمایه‌گذاری مسکن",
    "مشاوره رایگان",
    "بازار تهران",
  ],
};

export default async function HomePage(): Promise<JSX.Element> {
  let posts: Post[] = [];

  try {
    posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      take: 9,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
            bio: true,
          },
        },
      },
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
  }

  const features = [
    {
      icon: Shield,
      text: "مشاوره تخصصی رایگان",
      description: "دریافت مشاوره رایگان از متخصصین با تجربه",
      color: "text-blue-600",
    },
    {
      icon: Award,
      text: "گارانتی اصالت ملک",
      description: "تضمین اصالت و صحت اطلاعات تمامی املاک",
      color: "text-green-600",
    },
    {
      icon: Heart,
      text: "پشتیبانی ۲۴ ساعته",
      description: "پشتیبانی و پاسخگویی در تمامی ساعات",
      color: "text-red-600",
    },
    {
      icon: Building,
      text: "املاک منتخب تهران",
      description: "دسترسی به برترین املاک پایتخت",
      color: "text-purple-600",
    },
  ];

  const siteFeatures = [
    { icon: Home, text: "جدیدترین املاک روز", color: "text-[#FEC360]" },
    { icon: FileText, text: "مقالات و تحلیل‌های تخصصی", color: "text-[#FEC360]" },
    { icon: Video, text: "ویدیوهای آموزشی و مشاوره‌ای", color: "text-[#FEC360]" },
    { icon: Users, text: "ارتباط با کارشناسان حرفه‌ای", color: "text-[#FEC360]" },
  ];

  return (
    <div className="min-h-screen w-full bg-gray-50">
      {/* Hero Slider */}
      <EmblaSlider />

      {/* معرفی صاحب سایت */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* عکس و اطلاعات شخصی */}
            <div className="text-center lg:text-right">
              <div className="relative inline-block">
                <div className="w-48 h-48 mx-auto lg:mx-0 rounded-full bg-gradient-to-br from-[#FEC360] to-amber-500 p-1 shadow-2xl">
                  <div className="w-full h-full rounded-full bg-white p-2">
                    <div className="w-full h-full rounded-full bg-gray-200 overflow-hidden">
                      <Image
                        src={siteOwner.image}
                        alt={siteOwner.name}
                        width={192}
                        height={192}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-2 bg-[#FEC360] text-gray-900 p-3 rounded-full shadow-lg">
                  <Award className="w-6 h-6" />
                </div>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mt-6 mb-2">
                {siteOwner.name}
              </h1>
              <p className="text-xl text-[#FEC360] font-semibold mb-4">
                {siteOwner.title}
              </p>

              <p className="text-gray-600 leading-7 text-lg mb-6 max-w-md mx-auto lg:mx-0">
                {siteOwner.bio}
              </p>

              {/* آمار و ارقام */}
              <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto lg:mx-0 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#FEC360]">
                    {siteOwner.experience}
                  </div>
                  <div className="text-sm text-gray-500">تجربه</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#FEC360]">
                    {siteOwner.satisfiedClients}
                  </div>
                  <div className="text-sm text-gray-500">مشتری راضی</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#FEC360]">
                    {siteOwner.successfulDeals}
                  </div>
                  <div className="text-sm text-gray-500">معامله موفق</div>
                </div>
              </div>

              {/* تخصص‌ها */}
              <div className="flex flex-wrap gap-2 justify-center lg:justify-start mb-6">
                {siteOwner.specialties.map((specialty, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium border border-gray-200"
                  >
                    {specialty}
                  </span>
                ))}
              </div>

              {/* دکمه‌های ارتباط */}
              <div className="flex gap-3 justify-center lg:justify-start">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-[#FEC360] text-gray-900 px-6 py-3 rounded-xl font-semibold hover:bg-amber-400 transition shadow-lg"
                >
                  <MessageCircle className="w-4 h-4" />
                  گفتگو با من
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 bg-gray-800 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-900 transition shadow-lg"
                >
                  <Users className="w-4 h-4" />
                  درباره من
                </Link>
              </div>
            </div>

            {/* ویژگی‌ها و خدمات */}
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center lg:text-right">
                چرا با <span className="text-[#FEC360]">من</span> همکاری کنید؟
              </h2>

              {features.map(
                ({ icon: Icon, text, description, color }, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 group hover:border-[#FEC360]/30"
                  >
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ${color}`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800 text-lg mb-2">
                        {text}
                      </h3>
                      <p className="text-gray-600 leading-6">{description}</p>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      {/* آخرین مطالب و مقالات */}
      <section className="py-20 bg-gradient-to-b from-gray-100 to-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-gray-800 relative inline-block">
              <span className="text-[#FEC360]">آخرین مقالات</span> و تحلیل‌های من
              <div className="absolute -bottom-2 left-1/4 w-1/2 h-1 bg-[#FEC360] rounded-full" />
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              تجربیات، تحلیل‌های بازار و راهنمایی‌های تخصصی در حوزه املاک و سرمایه‌گذاری
            </p>
          </div>

          {/* حالت خالی */}
          {posts.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-white rounded-2xl p-12 max-w-2xl mx-auto border border-gray-200 shadow-lg">
                <FileText className="w-20 h-20 text-gray-300 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-gray-700 mb-4">
                  به زودی مقالات جدید منتشر می‌شود
                </h3>
                <p className="text-gray-500 text-lg mb-8 max-w-md mx-auto">
                  در حال آماده‌سازی مطالب آموزشی و تحلیلی جدید برای شما هستم
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/listings"
                    className="inline-flex items-center gap-2 bg-[#FEC360] text-gray-900 px-6 py-3 rounded-xl font-semibold hover:bg-amber-400 transition shadow-lg"
                  >
                    <Home className="w-4 h-4" />
                    مشاهده املاک
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 bg-gray-800 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-900 transition shadow-lg"
                  >
                    <Phone className="w-4 h-4" />
                    تماس با من
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            /* نمایش پست‌ها */
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post) => (
                  <article
                    key={post.id}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200 group"
                  >
                    {/* تصویر پست */}
                    <div className="relative h-48 w-full overflow-hidden">
                      {post.imageUrl ? (
                        <Image
                          src={`/images/${post.imageUrl}`}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : post.videoUrl ? (
                        <div className="relative h-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
                          <div className="absolute inset-0 bg-[#FEC360]/10 flex items-center justify-center">
                            <PlayCircle className="w-12 h-12 text-white opacity-90" />
                          </div>
                        </div>
                      ) : (
                        <div className="bg-gradient-to-br from-gray-100 to-gray-200 h-full flex items-center justify-center">
                          <FileText className="w-12 h-12 text-gray-400" />
                        </div>
                      )}

                      {/* Overlay و اطلاعات */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                      {/* دسته‌بندی */}
                      {post.category && (
                        <div className="absolute top-4 left-4">
                          <span className="bg-[#FEC360] text-gray-900 px-3 py-1 rounded-full text-xs font-bold">
                            {post.category}
                          </span>
                        </div>
                      )}

                      {/* نویسنده */}
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
                            <span className="text-white text-xs font-bold">
                              {post.author?.name?.charAt(0) || "س"}
                            </span>
                          </div>
                          <div className="text-white text-sm">
                            {post.author?.name || siteOwner.name}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* محتوای پست */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-[#FEC360] transition-colors duration-300 line-clamp-2">
                        <Link href={`/posts/${post.id}`}>{post.title}</Link>
                      </h3>

                      <p className="text-gray-600 text-sm leading-6 mb-4 line-clamp-3">
                        {post.content}
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-4 text-gray-500 text-sm">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(post.createdAt).toLocaleDateString("fa-IR")}
                          </div>
                        </div>

                        <Link
                          href={`/posts/${post.id}`}
                          className="flex items-center gap-1 text-[#FEC360] text-sm font-semibold hover:text-amber-600 transition-colors"
                        >
                          مطالعه مقاله
                          <ArrowLeft className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {/* دکمه مشاهده همه */}
              <div className="text-center mt-12">
                <Link
                  href="/posts"
                  className="inline-flex items-center gap-2 bg-gray-800 text-white px-8 py-3 rounded-xl font-semibold hover:bg-gray-900 transition shadow-lg hover:shadow-xl"
                >
                  مشاهده همه پست‌ها
                  <ArrowLeft className="w-4 h-4" />
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gradient-to-br from-gray-100 to-gray-200 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold mb-4 text-gray-800">
              چرا سامانه <span className="text-[#FEC360]">خان</span>؟
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              تمام ابزارها و خدمات مورد نیاز شما در حوزه املاک، در یک پلتفرم
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {siteFeatures.map(({ icon: Icon, text, color }, index) => (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 text-center group"
              >
                <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-[#FEC360]/10 flex items-center justify-center group-hover:shadow-lg transition-all duration-300 ${color}`}>
                  <Icon className="w-8 h-8" />
                </div>

                <h3 className="font-bold text-gray-800 text-lg mb-3">{text}</h3>

                <div className="w-8 h-1 bg-[#FEC360] rounded-full mx-auto mt-4" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA نهایی */}
      <section className="bg-gradient-to-r from-[#FEC360] to-amber-500 py-20 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-12 border border-white/20">
            <h3 className="text-4xl font-bold mb-6 text-gray-800">
              آماده پیدا کردن ملک دلخواهتان هستید؟
            </h3>
            <p className="text-xl text-gray-900 mb-8 max-w-2xl mx-auto leading-8">
              با جستجو در بین املاک فعال، ملک مورد نظرتان را با بهترین قیمت پیدا کنید 
              و از مشاوره رایگان ما بهره‌مند شوید
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/listings"
                className="inline-flex items-center gap-3 bg-gray-800 text-white px-8 py-4 rounded-2xl font-bold hover:bg-gray-900 transition shadow-2xl hover:scale-105"
              >
                <Home className="w-5 h-5" />
                مشاهده همه املاک
              </Link>
              <Link
                href="/listings?dealType=فروش"
                className="inline-flex items-center gap-3 bg-white text-gray-900 px-8 py-4 rounded-2xl font-bold hover:bg-gray-100 transition shadow-2xl hover:scale-105"
              >
                <Building className="w-5 h-5" />
                املاک برای فروش
              </Link>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
              <Link
                href="/listings?dealType=رهن و اجاره"
                className="inline-flex items-center gap-3 bg-white/80 text-gray-900 px-6 py-3 rounded-xl font-semibold hover:bg-white transition shadow-lg hover:scale-105"
              >
                املاک برای اجاره
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-3 bg-white/80 text-gray-900 px-6 py-3 rounded-xl font-semibold hover:bg-white transition shadow-lg hover:scale-105"
              >
                <MessageCircle className="w-4 h-4" />
                دریافت مشاوره
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}