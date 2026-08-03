import type { Metadata } from "next";
import { LandingHeader } from "@/components/landing/landing-header";
import { LandingHero } from "@/components/landing/landing-hero";
import { LandingFeatures } from "@/components/landing/landing-features";
import { LandingScreenshots } from "@/components/landing/landing-screenshots";
import { LandingDownloadCta } from "@/components/landing/landing-download-cta";
import { LandingFooter } from "@/components/landing/landing-footer";

export const metadata: Metadata = {
  title: "내근무 - 교번근무표 확인 앱",
  description: "교번근무자를 위한 교번근무표 확인 앱, 내근무. iOS/Android에서 다운로드하세요.",
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      <main>
        <LandingHero />
        <LandingFeatures />
        <LandingScreenshots />
        <LandingDownloadCta />
      </main>
      <LandingFooter />
    </div>
  );
}
