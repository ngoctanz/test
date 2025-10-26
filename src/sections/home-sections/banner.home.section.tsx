"use client";
import NoticeTicker from "@/components/notices/notice-ticker.marquee";
import Image from "next/image";

export default function BannerHomeSection() {
  return (
    <div className="w-full flex flex-col justify-center">
      <div className="mx-auto w-full max-w-[1300px] px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="bg-white p-2 rounded-xl shadow-lg">
          <div
            className="relative w-full rounded-lg overflow-hidden bg-gray-100"
            style={{ aspectRatio: "1254/450" }}
          >
            <Image
              src="/images/dynamic_images/banner.gif"
              alt="Shop Game Việt Banner"
              fill
              className="object-cover"
              priority
              unoptimized
            />
          </div>
        </div>

        {/* Notice Ticker */}
        <NoticeTicker />
      </div>
    </div>
  );
}
