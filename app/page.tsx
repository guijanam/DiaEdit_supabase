"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Train } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/auth-context";
import * as api from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const { login, loading: authLoading, isAuth } = useAuth();
  const [offices, setOffices] = useState<string[]>([]);
  const [loadingOffices, setLoadingOffices] = useState(true);
  const [officeName, setOfficeName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isAuth) {
      router.replace("/dashboard");
    }
  }, [isAuth, router]);

  useEffect(() => {
    api
      .fetchOfficeList()
      .then(setOffices)
      .catch((e) => console.error("승무소 목록 로드 오류:", e))
      .finally(() => setLoadingOffices(false));
  }, []);

  const handleLogin = async () => {
    if (!officeName || !password) return;
    setError("");
    setSubmitting(true);
    const errorMsg = await login(officeName, password);
    setSubmitting(false);
    if (errorMsg) {
      setError(errorMsg);
    } else {
      router.push("/dashboard");
    }
  };

  const isLoading = submitting || authLoading;

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Train className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl">승무소 Dia관리 시스템</CardTitle>
            <CardDescription>승무소별로 편하게 수정하세요</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label>승무소 선택</Label>
              {loadingOffices ? (
                <Skeleton className="h-9 w-full" />
              ) : (
                <Select value={officeName} onValueChange={setOfficeName}>
                  <SelectTrigger>
                    <SelectValue placeholder="승무소를 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {offices.map((office) => (
                      <SelectItem key={office} value={office}>
                        {office}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
            <div className="space-y-2">
              <Label>비밀번호</Label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              onClick={handleLogin}
              disabled={isLoading || !officeName || !password}
            >
              {isLoading ? "인증 중..." : "로그인"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
