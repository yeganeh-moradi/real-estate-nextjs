import prisma from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { PlayCircle, Home, Video, FileText, Users, ArrowLeft, RefreshCw } from "lucide-react";
import EmblaSlider from '@/components/HomeComponents/EmblaSlider';
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
}

export default async function HomePage(): Promise<JSX.Element>{
  let posts: Post[] = [];

  try {
    posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      take: 12
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    // در صورت خطا، posts به صورت آرایه خالی باقی می‌ماند
  }

  const features = [
    { icon: Home, text: "جدیدترین املاک روز", color: "text-[#FEC360]" },
    { icon: FileText, text: "مقالات و تحلیل‌های تخصصی", color: "text-[#FEC360]" },
    { icon: Video, text: "ویدیوهای آموزشی و مشاوره‌ای", color: "text-[#FEC360]" },
    { icon: Users, text: "ارتباط با کارشناسان حرفه‌ای", color: "text-[#FEC360]" },
  ];

  return (
      <>
        {/* Hero Slider */}
        <EmblaSlider />

        {/* About Section */}
        <section className="py-20 bg-gradient-to-b from-gray-100 to-gray-200">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-4xl font-extrabold mb-6 text-gray-800 tracking-tight">
              سامانه <span className="text-[#FEC360]">خان</span>
            </h2>
            <p className="text-gray-600 text-lg leading-8 max-w-3xl mx-auto">
              «خان» پلتفرمی مدرن برای اشتراک‌گذاری پست‌های آموزشی، ویدیوها و اخبار
              حوزه املاک است. هدف ما این است که مسیر خرید، فروش و سرمایه‌گذاری در
              ملک را برای کاربران <span className="font-semibold text-[#FEC360]">ساده‌تر</span> و <span className="font-semibold text-gray-800">آگاهانه‌تر</span> کنیم.
            </p>
          </div>
        </section>

        {/* Posts grid */}
        <section className="max-w-7xl mx-auto px-4 py-20 bg-white">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold mb-4 text-gray-800 relative inline-block">
              جدیدترین پست‌ها
              <div className="absolute -bottom-2 left-0 w-1/2 h-1 bg-[#FEC360] rounded-full mx-auto" />
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              تازه‌ترین مقالات، تحلیل‌ها و ویدیوهای آموزشی در حوزه املاک و مسکن
            </p>
          </div>

          {/* حالت خالی یا خطا */}
          {posts.length === 0 ? (
              <div className="text-center py-16">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-12 max-w-2xl mx-auto border border-gray-200">
                  <FileText className="w-20 h-20 text-gray-300 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-gray-700 mb-4">
                    هنوز پستی وجود ندارد
                  </h3>
                  <p className="text-gray-500 text-lg mb-8 max-w-md mx-auto">
                    به زودی مقالات و محتوای آموزشی جدید در این بخش قرار خواهد گرفت
                  </p>

                  {/* دکمه‌های اقدام */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/listings"
                        className="inline-flex items-center gap-2 bg-[#FEC360] text-gray-900 px-6 py-3 rounded-xl font-semibold hover:bg-[#fed27a] transition shadow-lg"
                    >
                      مشاهده املاک
                      <Home className="w-4 h-4" />
                    </Link>
                    <Link
                        href="/posts"
                        className="inline-flex items-center gap-2 bg-gray-800 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-900 transition shadow-lg"
                    >
                      <RefreshCw className="w-4 h-4" />
                      بارگذاری مجدد
                    </Link>
                  </div>
                </div>
              </div>
          ) : (
              /* حالت عادی - نمایش پست‌ها */
              <>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {posts.map((post) => (
                      <Link
                          href={`/posts/${post.id}`}
                          key={post.id}
                          className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200"
                      >
                        <div className="relative h-64 w-full overflow-hidden">
                          {post.imageUrl ? (
                              <Image
                                  src={"/images/" + post.imageUrl}
                                  alt={post.title}
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                          ) : post.videoUrl ? (
                              <div className="relative h-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
                                <div className="absolute inset-0 bg-[#FEC360]/10 flex items-center justify-center">
                                  <PlayCircle className="w-16 h-16 text-white opacity-90 drop-shadow-2xl" />
                                </div>
                              </div>
                          ) : (
                              <div className="bg-gradient-to-br from-gray-100 to-gray-200 h-full flex items-center justify-center">
                                <FileText className="w-12 h-12 text-gray-400" />
                              </div>
                          )}

                          {/* Overlay */}
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-300" />

                          {/* Category Badge */}
                          {post.category && (
                              <div className="absolute top-4 left-4">
                        <span className="bg-[#FEC360]/90 text-gray-800 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
                          {post.category}
                        </span>
                              </div>
                          )}
                        </div>

                        <div className="p-6">
                          <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-[#FEC360] transition-colors duration-300 line-clamp-2">
                            {post.title}
                          </h3>

                          <p className="text-gray-600 text-sm leading-6 mb-4 line-clamp-3">
                            {post.content}
                          </p>

                          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                            <div className="flex items-center gap-2 text-gray-500 text-sm">
                              {new Date(post.createdAt).toLocaleDateString("fa-IR")}
                            </div>

                            <div className="flex items-center gap-1 text-[#FEC360] text-sm font-medium">
                              مطالعه مقاله
                              <ArrowLeft className="w-4 h-4" />
                            </div>
                          </div>
                        </div>
                      </Link>
                  ))}
                </div>

                {/* View All Posts Button */}
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
              {features.map(({ icon: Icon, text, color }, index) => (
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

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-[#FEC360] to-[#fed27a] py-20 text-center">
          <div className="max-w-4xl mx-auto px-4">
            <h3 className="text-4xl font-extrabold mb-6 text-gray-800">به دنبال ملک دلخواهت هستی؟</h3>
            <p className="text-xl text-gray-900 mb-8 max-w-2xl mx-auto leading-8">
              لیست کامل املاک را با جدیدترین قیمت‌ها مشاهده کن و با استفاده از فیلترهای پیشرفته،
              ملک مورد نظرت را در کمترین زمان پیدا کن
            </p>

            <Link
                href="/listings"
                className="inline-flex items-center gap-3 bg-gray-800 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-gray-900 transition shadow-2xl hover:shadow-3xl"
            >
              مشاهده املاک
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </>
  );
}