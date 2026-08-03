import { RefreshCw, Train, FileImage, ShieldCheck, Building2, FileJson } from "lucide-react";
import { Container } from "@/components/layout/container";
import { FeatureCard } from "@/components/landing/feature-card";

const features = [
  {
    icon: RefreshCw,
    title: "오늘 내 근무 한눈에",
    description: "기관사·차장별 교번순서를 기반으로 오늘 내 근무를 바로 확인할 수 있습니다.",
  },
  {
    icon: Train,
    title: "다이아(운행표) 상세 확인",
    description: "출근시간, 전반·후반 사업시간, 열차번호, 총 근무시간까지 근무 코드별로 조회합니다.",
  },
  {
    icon: FileImage,
    title: "행로표 이미지 첨부 조회",
    description: "근무 세부 일정을 텍스트뿐 아니라 첨부된 행로표 사진으로도 확인할 수 있습니다.",
  },
  {
    icon: ShieldCheck,
    title: "신뢰도 높은 근무표 갱신",
    description: "교통회사에 지속적인 API 요청으로 신속하고 정확한 근무 반영을 위해 노력하고 있습니다.",
  },
  {
    icon: Building2,
    title: "승무소별 맞춤 데이터",
    description: "소속 승무소를 선택하면 해당 승무소의 근무표와 교번순서만 골라서 확인합니다.",
  },
  {
    icon: FileJson,
    title: "근무표 데이터 백업",
    description: "근무표 데이터를 JSON 파일로 내보내고 다시 불러올 수 있어 백업과 이전이 간편합니다.",
  },
];

export function LandingFeatures() {
  return (
    <section className="py-16 md:py-24">
      <Container>
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-balance">
            교번근무자를 위한 필수 기능
          </h2>
          <p className="mt-3 text-muted-foreground text-balance">
            매번 근무표를 찾아 헤매지 않아도, 내근무 하나면 충분합니다.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </Container>
    </section>
  );
}
