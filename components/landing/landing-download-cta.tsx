import { Container } from "@/components/layout/container";
import { StoreBadges } from "@/components/landing/store-badges";

export function LandingDownloadCta() {
  return (
    <section className="bg-gradient-to-br from-sky-50 to-emerald-50 py-16 dark:from-sky-950/20 dark:to-emerald-950/20 md:py-24">
      <Container className="flex flex-col items-center gap-6 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-balance">
          지금 바로 내근무를 시작하세요
        </h2>
        <p className="max-w-md text-muted-foreground text-balance">
          iOS와 Android 모두 지원합니다. 지금 다운로드하고 내 근무를 한눈에 확인해보세요.
        </p>
        <StoreBadges size="lg" />
      </Container>
    </section>
  );
}
