import { Container } from "@/components/layout/container";
import { ScreenshotPlaceholder } from "@/components/landing/screenshot-placeholder";

const SCREENSHOT_SLOTS = 4;

export function LandingScreenshots() {
  return (
    <section className="bg-muted/30 py-16 md:py-24">
      <Container>
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-balance">
            앱 화면 미리보기
          </h2>
          <p className="mt-3 text-muted-foreground text-balance">
            실제 앱 화면은 곧 공개됩니다.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          {Array.from({ length: SCREENSHOT_SLOTS }).map((_, i) => (
            <ScreenshotPlaceholder key={i} />
          ))}
        </div>
      </Container>
    </section>
  );
}
