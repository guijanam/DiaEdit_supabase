"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { LogOut } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

function DashboardGuard({ children }: { children: React.ReactNode }) {
  const { isAuth, officeName, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuth) {
      router.replace("/");
    }
  }, [isAuth, router]);

  if (!isAuth) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
        <Container className="flex h-16 items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">{officeName}</h1>
            <p className="text-xs text-muted-foreground">데이터 관리</p>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                logout();
                router.push("/");
              }}
            >
              <LogOut className="mr-1 h-4 w-4" />
              로그아웃
            </Button>
          </div>
        </Container>
      </header>
      <main>{children}</main>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardGuard>{children}</DashboardGuard>;
}
