"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import * as uploadApi from "@/lib/upload-api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDateTime } from "@/lib/utils";
import { ExtractionReviewDialog } from "@/components/dashboard/extraction-review-dialog";
import type { DiaExtractionBatch } from "@/types";

interface ExtractionInboxTabProps {
  onCountChange?: (count: number) => void;
}

export function ExtractionInboxTab({ onCountChange }: ExtractionInboxTabProps) {
  const { officeName, reloadData } = useAuth();
  const [batches, setBatches] = useState<DiaExtractionBatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<DiaExtractionBatch | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await uploadApi.fetchPendingBatches(officeName);
      setBatches(data);
      onCountChange?.(data.length);
    } catch (e) {
      console.error("대기함 조회 오류:", e);
    } finally {
      setLoading(false);
    }
  }, [officeName, onCountChange]);

  useEffect(() => {
    load();
  }, [load]);

  const handleProcessed = async () => {
    await load();
    await reloadData();
  };

  if (loading) {
    return (
      <div className="space-y-2 p-4">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    );
  }

  if (batches.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        대기중인 자동추출 항목이 없습니다.
      </div>
    );
  }

  return (
    <div className="divide-y">
      {batches.map((batch) => (
        <div
          key={batch.id}
          className="flex items-center justify-between gap-4 p-4 hover:bg-muted/50"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-medium">{batch.rows.length}개 항목</span>
              <Badge variant="secondary" className="text-xs">
                {formatDateTime(batch.created_at)}
              </Badge>
              {batch.warning && (
                <Badge variant="destructive" className="text-xs">
                  경고 있음
                </Badge>
              )}
            </div>
          </div>
          <Button size="sm" onClick={() => setSelected(batch)}>
            검토하기
          </Button>
        </div>
      ))}

      {selected && (
        <ExtractionReviewDialog
          batch={selected}
          open={!!selected}
          onClose={() => setSelected(null)}
          onProcessed={handleProcessed}
        />
      )}
    </div>
  );
}
