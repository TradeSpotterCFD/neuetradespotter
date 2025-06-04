"use client";

import React, { useCallback, useEffect, useState } from 'react';
// Korrigierte Typ-Importe basierend auf Fehlermeldungen
import type { EmblaOptionsType } from 'embla-carousel'; // Importiere Typ aus dem Basispaket
import useEmblaCarousel, { type UseEmblaCarouselType } from 'embla-carousel-react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Circle } from 'lucide-react';
import { cn } from "@/lib/utils";

type PropType = {
  slides: string[];
  options?: EmblaOptionsType; // Typ sollte jetzt korrekt sein
  showArrows?: boolean;
  showDots?: boolean;
};

const ImageSlider: React.FC<PropType> = (props) => {
  const { slides, options, showArrows = true, showDots = true } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(options);
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollPrev = useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi]
  );
  const scrollNext = useCallback(
    () => emblaApi && emblaApi.scrollNext(),
    [emblaApi]
  );
  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi]
  );

  const onInit = useCallback((api: UseEmblaCarouselType[1]) => {
    if (!api) return;
    setScrollSnaps(api.scrollSnapList());
  }, []);

  const onSelect = useCallback((api: UseEmblaCarouselType[1]) => {
    if (!api) return;
    setSelectedIndex(api.selectedScrollSnap());
    setPrevBtnDisabled(!api.canScrollPrev());
    setNextBtnDisabled(!api.canScrollNext());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    onInit(emblaApi);
    onSelect(emblaApi);

    const handleReInit = () => {
        onInit(emblaApi);
        onSelect(emblaApi);
    };
    const handleSelect = () => onSelect(emblaApi);

    emblaApi.on('reInit', handleReInit);
    emblaApi.on('select', handleSelect);

    return () => {
      emblaApi.off('reInit', handleReInit);
      emblaApi.off('select', handleSelect);
    };
  }, [emblaApi, onInit, onSelect]);

  if (!slides || slides.length === 0) {
    return null;
  }

  return (
    <div className="relative group">
      <div className="overflow-hidden rounded-lg" ref={emblaRef}>
        <div className="flex">
          {slides.map((imageUrl, index) => (
            <div className="relative flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.33%] aspect-video" key={index}>
              <Image
                src={imageUrl}
                alt={`Slider image ${index + 1}`}
                fill
                className="object-cover rounded-md"
                unoptimized={process.env.NODE_ENV === 'development'}
              />
            </div>
          ))}
        </div>
      </div>

      {showArrows && (
        <>
          <button
            className={cn(
              "absolute top-1/2 left-2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10",
              "disabled:opacity-30 disabled:cursor-not-allowed"
            )}
            onClick={scrollPrev}
            disabled={prevBtnDisabled}
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            className={cn(
              "absolute top-1/2 right-2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10",
              "disabled:opacity-30 disabled:cursor-not-allowed"
            )}
            onClick={scrollNext}
            disabled={nextBtnDisabled}
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      {showDots && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={cn(
                "p-1 rounded-full",
                index === selectedIndex ? 'opacity-100' : 'opacity-50 hover:opacity-75'
              )}
              aria-label={`Go to slide ${index + 1}`}
            >
               <Circle className={cn("h-2 w-2", index === selectedIndex ? 'fill-white' : 'fill-gray-400')} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageSlider;