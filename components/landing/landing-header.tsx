"use client";

import Image from "next/image";
import Link from "next/link";
import { Mail } from "lucide-react";
import { Container } from "@/components/layout/container";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

export function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
      <Container className="flex h-16 items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Image
              src="/app-icon.png"
              alt="내근무 앱 아이콘"
              width={32}
              height={32}
              className="rounded-lg ring-1 ring-border"
            />
            <span className="text-lg font-bold">내근무</span>
          </div>
          <a
            href="mailto:02b2min2@kakao.com"
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <Mail className="h-4 w-4 shrink-0" />
            <span className="hidden sm:inline">02b2min2@kakao.com</span>
          </a>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button asChild variant="ghost" size="sm">
            <Link href="/login">교번수정</Link>
          </Button>
        </div>
      </Container>
    </header>
  );
}
