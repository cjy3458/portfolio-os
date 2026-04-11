"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";

interface ImageGalleryProps {
  images: string[];
}

export default function ImageGallery({ images }: ImageGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const prev = () =>
    setLightboxIndex((i) =>
      i !== null ? (i - 1 + images.length) % images.length : 0,
    );
  const next = () =>
    setLightboxIndex((i) => (i !== null ? (i + 1) % images.length : 0));

  return (
    <>
      <section>
        <SectionHeader title="Screenshots (상세보기는 이미지 클릭!)" />
        <div
          className={`grid gap-3 ${images.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}
        >
          {images.map((src, idx) => (
            <button
              key={src}
              onClick={() => setLightboxIndex(idx)}
              className={`relative aspect-video border-2 border-black overflow-hidden shadow-card hover:shadow-none hover:translate-y-0.5 transition-all ${
                images.length % 2 !== 0 && idx === images.length - 1
                  ? "col-span-2"
                  : ""
              }`}
            >
              <Image
                src={src}
                alt={`screenshot-${idx + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      </section>

      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            className="absolute left-4 text-white border-2 border-white p-2 hover:bg-white hover:text-black transition-colors"
          >
            <ChevronLeft size={24} />
          </button>

          <div
            className="relative max-w-4xl w-full h-[80vh] mx-16"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[lightboxIndex]}
              alt={`screenshot-${lightboxIndex + 1}`}
              fill
              className="object-contain border-2 border-white"
            />
            <span className="absolute bottom-2 right-2 text-white text-xs font-bold bg-black px-2 py-0.5">
              {lightboxIndex + 1} / {images.length}
            </span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            className="absolute right-4 text-white border-2 border-white p-2 hover:bg-white hover:text-black transition-colors"
          >
            <ChevronRight size={24} />
          </button>

          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-4 right-4 text-white border-2 border-white p-1 hover:bg-white hover:text-black transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      )}
    </>
  );
}
