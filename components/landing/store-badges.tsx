"use client";

import { useSyncExternalStore } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
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

  return (
    <div className={cn("flex flex-col gap-3 sm:flex-row", className)}>
      <Button
        asChild
        size={size === "lg" ? "lg" : "default"}
        variant={detected === "aos" ? "outline" : "default"}
        className={cn(
          detected !== "aos" &&
            "bg-sky-500 text-white hover:bg-sky-600 dark:bg-sky-600 dark:hover:bg-sky-500"
        )}
      >
        <a href={IOS_STORE_URL} target="_blank" rel="noopener noreferrer">
          <Download />
          App Store에서 다운로드
        </a>
      </Button>
      <Button
        asChild
        size={size === "lg" ? "lg" : "default"}
        variant={detected === "ios" ? "outline" : "default"}
        className={cn(
          detected !== "ios" &&
            "bg-emerald-500 text-white hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-500"
        )}
      >
        <a href={AOS_STORE_URL} target="_blank" rel="noopener noreferrer">
          <Download />
          Google Play에서 다운로드
        </a>
      </Button>
    </div>
  );
}
