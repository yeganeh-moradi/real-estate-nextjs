"use client";

import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";

function EmblaSlider() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { 
      loop: true, 
      direction: "rtl",
      duration: 50
    }, 
    [Autoplay({ delay: 5000, stopOnInteraction: false })]
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    
    onSelect();
    emblaApi.on("select", onSelect);
    
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const toggleAutoplay = useCallback(() => {
    if (!emblaApi) return;
    
    if (isPlaying) {
      emblaApi.plugins().autoplay?.stop();
    } else {
      emblaApi.plugins().autoplay?.play();
    }
    setIsPlaying(!isPlaying);
  }, [emblaApi, isPlaying]);

  const slides = [
    {
      src: "/images/slide1.jpg",
      title: "با «خان» خانه رؤیایی‌ات را پیدا کن",
      subtitle: "پست‌ها و راهنمایی‌های تخصصی برای خریداران و فروشندگان",
    },
    {
      src: "/images/slide2.jpg",
      title: "پست‌های آموزشی و تحلیلی بازار ملک",
      subtitle: "تازه‌ترین تحلیل‌ها از بازار مسکن ایران",
    },
    {
      src: "/images/slide3.jpg",
      title: "ویدیوهای آموزشی و مصاحبه‌های اختصاصی",
      subtitle: "از کارشناسان املاک یاد بگیر",
    },
  ];

  return (
    <section className="relative w-full overflow-hidden border-b bg-gray-900">
      <div ref={emblaRef} className="overflow-hidden">
        <div className="embla__container flex" dir="rtl">
          {slides.map((slide, index) => (
            <div
              key={index}
              className="embla__slide flex-[0_0_100%] relative h-[500px] md:h-[600px] lg:h-[700px]"
              style={{ minWidth: "100%" }}
            >
              {/* Background Image with Animation */}
              <motion.div
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ 
                  scale: 1, 
                  opacity: 1,
                  transition: { 
                    duration: 1.2, 
                    ease: "easeOut" 
                  }
                }}
                className="absolute inset-0"
              >
                <Image
                  src={slide.src}
                  alt={slide.title}
                  fill
                  className="object-cover"
                  priority={index === 0}
                  sizes="100vw"
                  quality={90}
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
              </motion.div>

              {/* Content */}
              <div className="absolute inset-0 flex items-center">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="max-w-2xl mr-auto">
                    <motion.div
                      initial={{ x: -50, opacity: 0 }}
                      animate={{ 
                        x: 0, 
                        opacity: 1,
                        transition: { 
                          duration: 0.8, 
                          delay: 0.3,
                          ease: "easeOut" 
                        }
                      }}
                    >
                      <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                        {slide.title}
                      </h2>
                    </motion.div>

                    <motion.div
                      initial={{ x: -50, opacity: 0 }}
                      animate={{ 
                        x: 0, 
                        opacity: 1,
                        transition: { 
                          duration: 0.8, 
                          delay: 0.6,
                          ease: "easeOut" 
                        }
                      }}
                    >
                      <p className="text-lg sm:text-xl md:text-2xl text-gray-200 mb-8 leading-relaxed max-w-xl">
                        {slide.subtitle}
                      </p>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Controls - Only Play/Pause Button Remains */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-4 z-20">
        {/* Play/Pause Button */}
        <motion.button
          whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.2)" }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleAutoplay}
          className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 border border-white/20"
          aria-label={isPlaying ? "توقف اسلایدشو" : "پخش اسلایدشو"}
        >
          {isPlaying ? (
            <Pause className="w-5 h-5" />
          ) : (
            <Play className="w-5 h-5" />
          )}
        </motion.button>
      </div>

      {/* Slide Counter */}
      <div className="absolute top-8 left-8 z-20">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-black/30 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm font-medium border border-white/20"
        >
          <span className="text-blue-300">{selectedIndex + 1}</span>
          <span className="text-white/60"> / {slides.length}</span>
        </motion.div>
      </div>
    </section>
  );
}

export default EmblaSlider;