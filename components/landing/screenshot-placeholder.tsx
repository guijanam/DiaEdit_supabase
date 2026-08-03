import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScreenshotPlaceholderProps {
  src?: string;
  alt?: string;
  className?: string;
}

export function ScreenshotPlaceholder({ src, alt, className }: ScreenshotPlaceholderProps) {
  if (src) {
    return (
      <div
        className={cn(
          "relative aspect-[9/19.5] w-48 overflow-hidden rounded-2xl border shadow-sm sm:w-56",
          className
        )}
      >
        <Image src={src} alt={alt ?? "내근무 앱 스크린샷"} fill className="object-cover" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex aspect-[9/19.5] w-48 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed bg-muted text-muted-foreground sm:w-56",
        className
      )}
    >
      <ImageIcon className="h-8 w-8" />
      <span className="text-xs">스크린샷 준비중</span>
    </div>
  );
}
