"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Container } from "@/components/layout/container";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, ScanLine, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { OfficeSelectStep } from "@/components/upload/office-select-step";
import { FileDropZone } from "@/components/upload/file-drop-zone";
import { ExtractionPreview } from "@/components/upload/extraction-preview";
import * as uploadApi from "@/lib/upload-api";
import type { ExtractedDiaRow } from "@/types";

type Step = "office" | "upload" | "extracting" | "preview" | "submitted";

export default function UploadPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("office");
  const [officeName, setOfficeName] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [rows, setRows] = useState<ExtractedDiaRow[]>([]);
  const [warning, setWarning] = useState<string | undefined>();
  const [extractError, setExtractError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleExtract = async () => {
    setExtractError(null);
    setStep("extracting");
    try {
      const result = await uploadApi.extractDiaSchedule(officeName, files);
      setRows(result.rows);
      setWarning(result.warning);
      setStep("preview");
    } catch (e) {
      setExtractError(e instanceof Error ? e.message : String(e));
      setStep("upload");
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await uploadApi.submitExtractionBatch(officeName, rows, warning);
      setStep("submitted");
    } catch (e) {
      toast.error(`제출 실패: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setSubmitting(false);
    }
  };

  const resetToUpload = () => {
    setFiles([]);
    setRows([]);
    setWarning(undefined);
    setExtractError(null);
    setStep("upload");
  };

  return (
    <div className="min-h-screen bg-background">
      <Container className="flex max-w-2xl flex-col gap-4 py-8">
        <Button
          variant="ghost"
          size="sm"
          className="w-fit"
          onClick={() => router.push("/login")}
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          로그인 화면으로
        </Button>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <ScanLine className="h-5 w-5 text-primary" />
              <CardTitle>근무표 자동 업로드</CardTitle>
            </div>
            <CardDescription>
              근무표 사진을 올리면 AI가 내용을 읽어 제출합니다. 실제 근무표
              반영은 승무소 관리자가 로그인 후 검토·승인해야 이루어집니다.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === "office" && (
              <OfficeSelectStep
                onNext={(name) => {
                  setOfficeName(name);
                  setStep("upload");
                }}
              />
            )}

            {step === "upload" && (
              <div className="space-y-4">
                {extractError && (
                  <Alert variant="destructive">
                    <AlertDescription>{extractError}</AlertDescription>
                  </Alert>
                )}
                <p className="text-sm text-muted-foreground">
                  선택한 승무소: <span className="font-medium text-foreground">{officeName}</span>
                </p>
                <FileDropZone files={files} onFilesChange={setFiles} />
                <Button
                  className="w-full"
                  disabled={files.length === 0}
                  onClick={handleExtract}
                >
                  AI로 추출
                </Button>
              </div>
            )}

            {step === "extracting" && (
              <div className="flex flex-col items-center gap-3 py-10 text-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                <p className="text-sm text-muted-foreground">
                  AI가 근무표를 분석 중입니다... (최대 30초 소요)
                </p>
              </div>
            )}

            {step === "preview" && (
              <div className="space-y-4">
                <ExtractionPreview rows={rows} warning={warning} />
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={resetToUpload}>
                    다시 업로드
                  </Button>
                  <Button
                    className="flex-1"
                    disabled={submitting}
                    onClick={handleSubmit}
                  >
                    {submitting ? "제출 중..." : "제출"}
                  </Button>
                </div>
              </div>
            )}

            {step === "submitted" && (
              <div className="flex flex-col items-center gap-3 py-10 text-center">
                <CheckCircle2 className="h-10 w-10 text-primary" />
                <p className="font-medium">제출되었습니다.</p>
                <p className="text-sm text-muted-foreground">
                  승무소 관리자가 확인 후 근무표에 반영합니다.
                </p>
                <div className="mt-2 flex gap-2">
                  <Button variant="outline" onClick={() => router.push("/login")}>
                    로그인 화면으로
                  </Button>
                  <Button
                    onClick={() => {
                      resetToUpload();
                    }}
                  >
                    이 승무소에 계속 업로드
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </Container>
    </div>
  );
}
