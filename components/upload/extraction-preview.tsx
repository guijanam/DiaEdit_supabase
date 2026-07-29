"use client";

import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import type { ExtractedDiaRow } from "@/types";

interface ExtractionPreviewProps {
  rows: ExtractedDiaRow[];
  warning?: string;
}

export function ExtractionPreview({ rows, warning }: ExtractionPreviewProps) {
  const lowConfidenceCount = rows.filter((r) => r._confidence === "low").length;

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        {rows.length}개 근무 항목을 인식했습니다.
        {lowConfidenceCount > 0 && ` (확인이 필요한 항목 ${lowConfidenceCount}개)`}
      </p>
      {warning && (
        <Alert variant="destructive">
          <AlertTriangle />
          <AlertDescription>{warning}</AlertDescription>
        </Alert>
      )}
      {rows.length > 0 && (
        <div className="max-h-64 space-y-1 overflow-y-auto rounded-lg border p-2">
          {rows.map((row, i) => (
            <div
              key={i}
              className="flex items-center justify-between gap-2 rounded-md px-2 py-1 text-sm"
            >
              <div className="flex items-center gap-2">
                <span className="font-medium">{row.dia_id || "(ID 없음)"}</span>
                {row.type_name && (
                  <Badge variant="secondary" className="text-xs">
                    {row.type_name}
                  </Badge>
                )}
                {row._confidence === "low" && (
                  <Badge variant="destructive" className="text-xs">
                    확인필요
                  </Badge>
                )}
              </div>
              <span className="text-xs text-muted-foreground">
                {row.work_time || "-"}
              </span>
            </div>
          ))}
        </div>
      )}
      <p className="text-xs text-muted-foreground">
        여기서는 수정할 수 없습니다. 자세한 검토/수정은 승무소 관리자가 로그인 후
        대시보드에서 진행합니다.
      </p>
    </div>
  );
}
