import { Mail } from "lucide-react";
import { Container } from "@/components/layout/container";

export function LandingFooter() {
  return (
    <footer className="border-t py-10">
      <Container className="flex flex-col items-center gap-3 text-center text-sm text-muted-foreground">
        <p className="font-medium text-foreground">내근무</p>
        <a
          href="mailto:02b2min2@kakao.com"
          className="flex items-center gap-1 hover:text-foreground"
        >
          <Mail className="h-4 w-4" />
          02b2min2@kakao.com
        </a>
        <p>&copy; {new Date().getFullYear()} 내근무. All rights reserved.</p>
      </Container>
    </footer>
  );
}
