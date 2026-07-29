"use client";

import { useRef, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import * as uploadApi from "@/lib/upload-api";
import { uploadDiaImage } from "@/lib/storage-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { X, Plus, AlertTriangle, ImageUp } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { DiaExtractionBatch, ExtractedDiaRow } from "@/types";

const EMPTY_ROW: ExtractedDiaRow = {
  dia_id: "",
  type_name: "",
  work_time: "",
  first_time: "",
  second_time: "",
  third_time: "",
  total_time: "",
  num_tr1: "",
  num_tr2: "",
};

interface ExtractionReviewDialogProps {
  batch: DiaExtractionBatch;
  open: boolean;
  onClose: () => void;
  onProcessed: () => void;
}

export function ExtractionReviewDialog({
  batch,
  open,
  onClose,
  onProcessed,
}: ExtractionReviewDialogProps) {
  const { officeInfo } = useAuth();
  const [rows, setRows] = useState<ExtractedDiaRow[]>([...batch.rows]);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);

  const updateRow = (index: number, field: keyof ExtractedDiaRow, value: string) => {
    setRows((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const removeRow = (index: number) => {
    setRows((prev) => prev.filter((_, i) => i !== index));
  };

  const addRow = () => {
    setRows((prev) => [...prev, { ...EMPTY_ROW }]);
  };

  const handleApprove = async () => {
    if (!officeInfo) return;
    setProcessing(true);
    setProgress({ done: 0, total: rows.length });
    try {
      const { successCount, errors } = await uploadApi.approveBatch(
        batch,
        rows,
        officeInfo.office_code,
        (done, total) => setProgress({ done, total })
      );
      setProgress(null);
      if (errors.length === 0) {
        toast.success(`${successCount}건 반영 완료!`);
      } else {
        toast.error(`${successCount}건 반영, ${errors.length}건 실패: ${errors.join(", ")}`);
      }
      onProcessed();
      onClose();
    } catch (e) {
      toast.error(`승인 실패: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setProcessing(false);
      setProgress(null);
    }
  };

  const handleReject = async () => {
    setProcessing(true);
    try {
      await uploadApi.rejectBatch(batch.id);
      toast.success("반려 처리되었습니다.");
      onProcessed();
      onClose();
    } catch (e) {
      toast.error(`반려 실패: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent
        className="max-h-[85vh] max-w-4xl overflow-hidden flex flex-col"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        showCloseButton={false}
      >
        <DialogHeader>
          <DialogTitle>자동추출 검토 ({batch.office_name})</DialogTitle>
        </DialogHeader>

        <div className="flex-1 space-y-3 overflow-y-auto pr-2">
          {batch.warning && (
            <Alert variant="destructive">
              <AlertTriangle />
              <AlertDescription>{batch.warning}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            {rows.map((row, index) => {
              const lowConfidence = row._confidence === "low";
              return (
                <div
                  key={index}
                  className={cn(
                    "rounded-lg border p-2",
                    lowConfidence && "border-amber-300 bg-amber-50 dark:border-amber-800 dark:bg-amber-950"
                  )}
                >
                  <div className="mb-1 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      {lowConfidence && (
                        <>
                          <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                          확인 필요
                        </>
                      )}
                    </div>
                    <button
                      onClick={() => removeRow(index)}
                      className="p-1 text-destructive hover:text-destructive/80"
                      title="행 삭제"
                      type="button"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5">
                    <Field label="다이아ID" value={row.dia_id} onChange={(v) => updateRow(index, "dia_id", v)} />
                    <Field label="타입명" value={row.type_name} onChange={(v) => updateRow(index, "type_name", v)} />
                    <Field label="출근" value={row.work_time} onChange={(v) => updateRow(index, "work_time", v)} />
                    <Field label="전반시간" value={row.first_time} onChange={(v) => updateRow(index, "first_time", v)} />
                    <Field label="전반열번" value={row.num_tr1} onChange={(v) => updateRow(index, "num_tr1", v)} />
                    <Field label="후반시간" value={row.second_time} onChange={(v) => updateRow(index, "second_time", v)} />
                    <Field label="후반열번" value={row.num_tr2} onChange={(v) => updateRow(index, "num_tr2", v)} />
                    <Field
                      label="세번째"
                      value={row.third_time}
                      onChange={(v) => updateRow(index, "third_time", v)}
                      officeCode={officeInfo?.office_code ?? 0}
                      imageField="third_time"
                    />
                    <Field
                      label="총근무"
                      value={row.total_time}
                      onChange={(v) => updateRow(index, "total_time", v)}
                      officeCode={officeInfo?.office_code ?? 0}
                      imageField="total_time"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <Button variant="outline" className="w-full border-dashed" onClick={addRow}>
            <Plus className="mr-1 h-4 w-4" />
            행 추가
          </Button>
        </div>

        <DialogFooter className="gap-2 border-t pt-4">
          <Button variant="outline" onClick={handleReject} disabled={processing}>
            반려
          </Button>
          <Button onClick={handleApprove} disabled={processing || rows.length === 0}>
            {progress
              ? `저장 중... (${progress.done}/${progress.total})`
              : processing
                ? "처리 중..."
                : "승인 및 반영"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  value,
  onChange,
  officeCode,
  imageField,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  officeCode?: number;
  imageField?: "total_time" | "third_time";
}) {
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File | undefined) => {
    if (!file || !imageField) return;
    setUploading(true);
    try {
      const url = await uploadDiaImage(file, officeCode ?? 0, imageField);
      onChange(url);
      toast.success("이미지 업로드 완료!");
    } catch (e) {
      toast.error(`업로드 실패: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-0.5">
      <span className="text-[10px] text-muted-foreground">{label}</span>
      <div className="flex gap-0.5">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-7 text-xs"
        />
        {imageField && (
          <>
            <Button
              type="button"
              variant="outline"
              size="icon-xs"
              className="h-7 w-7 shrink-0"
              title="이미지 업로드"
              disabled={uploading}
              onClick={() => fileRef.current?.click()}
            >
              <ImageUp />
            </Button>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              hidden
              onChange={(e) => {
                handleUpload(e.target.files?.[0]);
                e.target.value = "";
              }}
            />
          </>
        )}
      </div>
    </div>
  );
}
