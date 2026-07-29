"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle } from "lucide-react";
import * as api from "@/lib/api";

interface OfficeSelectStepProps {
  onNext: (officeName: string) => void;
}

export function OfficeSelectStep({ onNext }: OfficeSelectStepProps) {
  const [offices, setOffices] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [officeName, setOfficeName] = useState("");

  useEffect(() => {
    api
      .fetchOfficeList()
      .then(setOffices)
      .catch((e) => console.error("승무소 목록 로드 오류:", e))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-4">
      <Alert>
        <AlertTriangle />
        <AlertDescription>
          비밀번호 없이 접근 가능합니다. 제출한 내용은 승무소 관리자의 승인 후
          근무표에 반영되니, 승무소명을 정확히 확인하세요.
        </AlertDescription>
      </Alert>
      <div className="space-y-2">
        <Label>승무소 선택</Label>
        {loading ? (
          <Skeleton className="h-9 w-full" />
        ) : (
          <Select value={officeName} onValueChange={setOfficeName}>
            <SelectTrigger className="w-full">
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
      <Button
        className="w-full"
        disabled={!officeName}
        onClick={() => onNext(officeName)}
      >
        다음
      </Button>
    </div>
  );
}
