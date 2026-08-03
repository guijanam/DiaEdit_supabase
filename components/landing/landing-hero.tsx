import Image from "next/image";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { StoreBadges } from "@/components/landing/store-badges";

export function LandingHero() {
  return (
    <section className="bg-gradient-to-b from-sky-50 to-background dark:from-sky-950/20 dark:to-background">
      <Container className="grid items-center gap-10 py-16 md:grid-cols-2 md:py-24">
        <div className="flex flex-col items-start gap-5">
          <Badge variant="outline" className="border-sky-300 text-sky-700 dark:border-sky-800 dark:text-sky-400">
            iOS / Android 지원
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight text-balance md:text-5xl">
            내 근무, 이제 한눈에 확인하세요
          </h1>
          <p className="text-lg text-muted-foreground text-balance">
            승무소별 교번근무표를 언제든 조회하는 &quot;내근무&quot; 앱. 오늘 내 근무부터
            다이아(운행표) 상세 정보까지, 필요한 순간 바로 확인할 수 있습니다.
          </p>
          <StoreBadges size="lg" />
        </div>
        <div className="flex justify-center md:justify-end">
          <Image
            src="/app-icon.png"
            alt="내근무 앱 아이콘"
            width={280}
            height={280}
            priority
            className="rounded-3xl shadow-lg ring-1 ring-border"
          />
        </div>
      </Container>
    </section>
  );
}
