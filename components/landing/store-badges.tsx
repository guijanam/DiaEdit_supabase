"use client";

import { useSyncExternalStore } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const IOS_STORE_URL =
  "https://apps.apple.com/us/app/%EB%82%B4%EA%B7%BC%EB%AC%B4-diacalendar2-%EA%B5%90%EB%B2%88%EA%B7%BC%EB%AC%B4-%EC%BA%98%EB%A6%B0%EB%8D%94/id6768628885";
const AOS_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.sonbum.diacalendar2&hl=ko";

type Platform = "ios" | "aos" | null;

function detectPlatform(): Platform {
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod/.test(ua)) return "ios";
  if (/Android/.test(ua)) return "aos";
  return null;
}

function subscribe() {
  return () => {};
}

// SSR/최초 렌더 시에는 항상 null을 반환해 서버-클라이언트 hydration mismatch를 방지한다.
function usePlatform(): Platform {
  return useSyncExternalStore(subscribe, detectPlatform, () => null);
}

interface StoreBadgesProps {
  size?: "default" | "lg";
  className?: string;
}

export function StoreBadges({ size = "default", className }: StoreBadgesProps) {
  const detected = usePlatform();
  const badgeHeight = size === "lg" ? "h-14" : "h-11";

  return (
    <div
      className={cn(
        "flex flex-col items-start gap-3 sm:flex-row sm:items-center",
        // 안드로이드에서는 Google Play 배지를 먼저 보여준다.
        detected === "aos" && "flex-col-reverse sm:flex-row-reverse sm:justify-end",
        className
      )}
    >
      <a
        href={IOS_STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="transition-opacity hover:opacity-80"
      >
        <Image
          src="/badges/app-store.svg"
          alt="App Store에서 다운로드"
          width={120}
          height={40}
          className={cn("w-auto", badgeHeight)}
        />
      </a>
      <a
        href={AOS_STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="transition-opacity hover:opacity-80"
      >
        <Image
          src="/badges/google-play.png"
          alt="Google Play에서 다운로드"
          width={580}
          height={170}
          className={cn("w-auto", badgeHeight)}
        />
      </a>
    </div>
  );
}
