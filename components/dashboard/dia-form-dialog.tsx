"use client";

import { useMemo, useRef, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import * as api from "@/lib/api";
import { uploadDiaImage } from "@/lib/storage-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ImageUp } from "lucide-react";
import { toast } from "sonner";
import type { Dia } from "@/types";

interface DiaFormDialogProps {
  dia: Partial<Dia>;
  open: boolean;
  onClose: () => void;
}

const DIA_TEXT_FIELDS = [
  "dia_id",
  "type_name",
  "work_time",
  "night_time",
  "first_time",
  "num_tr1",
  "second_time",
  "num_tr2",
  "total_time",
  "third_time",
] as const;

type DiaTextField = (typeof DIA_TEXT_FIELDS)[number];

const FIELD_LABELS: Record<DiaTextField, string> = {
  dia_id: "다이아 ID",
  type_name: "타입명",
  work_time: "출근시간",
  night_time: "야간시간",
  first_time: "전반사업 시간",
  num_tr1: "전반 열차번호",
  second_time: "후반사업 시간",
  num_tr2: "후반 열차번호",
  total_time: "총 근무시간",
  third_time: "세 번째 시간",
};

export function DiaFormDialog({ dia, open, onClose }: DiaFormDialogProps) {
  const { officeName, officeInfo, dias, reloadData } = useAuth();
  const [form, setForm] = useState<Record<DiaTextField, string>>({
    dia_id: dia.dia_id || "",
    type_name: dia.type_name || "",
    work_time: dia.work_time || "",
    night_time: dia.night_time || "",
    first_time: dia.first_time || "",
    num_tr1: dia.num_tr1 || "",
    second_time: dia.second_time || "",
    num_tr2: dia.num_tr2 || "",
    total_time: dia.total_time || "",
    third_time: dia.third_time || "",
  });
  const [saving, setSaving] = useState(false);
  const [uploadingField, setUploadingField] = useState<
    "total_time" | "third_time" | null
  >(null);
  const totalTimeFileRef = useRef<HTMLInputElement>(null);
  const thirdTimeFileRef = useRef<HTMLInputElement>(null);
  const activeInputRef = useRef<HTMLInputElement | null>(null);
  const [activeField, setActiveField] = useState<DiaTextField | null>(null);

  const isEditing = !!dia.id;

  const quickChars = useMemo(() => {
    const counts = new Map<string, number>();

    dias.forEach((item) => {
      DIA_TEXT_FIELDS.forEach((field) => {
        const value = item[field];
        if (!value || /^https?:\/\//i.test(value)) return;

        Array.from(value).forEach((char) => {
          if (/[A-Za-z0-9가-힣\s]/u.test(char) || /\p{M}/u.test(char)) {
            return;
          }
          counts.set(char, (counts.get(char) ?? 0) + 1);
        });
      });
    });

    return [...counts.entries()]
      .sort(([charA, countA], [charB, countB]) =>
        countB - countA || charA.localeCompare(charB)
      )
      .slice(0, 20)
      .map(([char]) => char);
  }, [dias]);

  const update = (field: DiaTextField, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleInputFocus = (
    field: DiaTextField,
    input: HTMLInputElement
  ) => {
    setActiveField(field);
    activeInputRef.current = input;
  };

  const insertQuickChar = (char: string) => {
    if (!activeField) return;

    const input = activeInputRef.current;
    const value = form[activeField];
    const start = input?.selectionStart ?? value.length;
    const end = input?.selectionEnd ?? start;
    const nextValue = value.slice(0, start) + char + value.slice(end);
    const nextCursor = start + char.length;

    update(activeField, nextValue);
    requestAnimationFrame(() => {
      input?.focus();
      input?.setSelectionRange(nextCursor, nextCursor);
    });
  };

  const handleImageUpload = async (
    field: "total_time" | "third_time",
    file: File | undefined
  ) => {
    if (!file) return;
    setUploadingField(field);
    try {
      const url = await uploadDiaImage(
        file,
        officeInfo?.office_code ?? 0,
        field
      );
      update(field, url);
      toast.success("이미지 업로드 완료!");
    } catch (e) {
      toast.error(`업로드 실패: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setUploadingField(null);
    }
  };

  const handleSave = async () => {
    if (!form.dia_id || !form.type_name) {
      toast.error("다이아 ID와 타입명은 필수입니다.");
      return;
    }
    setSaving(true);
    try {
      const diaData = {
        ...form,
        office_name: officeName,
        office_id: officeInfo?.office_code ?? 0,
      };

      if (isEditing) {
        await api.updateDia(dia.id!, diaData);
        toast.success("수정 완료!");
      } else {
        await api.createDia(diaData);
        toast.success("추가 완료!");
      }
      await reloadData();
      onClose();
    } catch (e) {
      toast.error(`실패: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent
        className="max-h-[85vh] max-w-2xl overflow-hidden flex flex-col"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        showCloseButton={false}
      >
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "다이아 수정" : "다이아 추가"}
          </DialogTitle>
        </DialogHeader>
        {quickChars.length > 0 && (
          <div className="rounded-lg border bg-muted/40 p-2">
            <div className="mb-2 flex items-center justify-between gap-2 text-xs text-muted-foreground">
              <span>자주 쓰는 문자</span>
              <span>
                {activeField
                  ? `${FIELD_LABELS[activeField]}에 삽입`
                  : "입력칸을 먼저 선택하세요"}
              </span>
            </div>
            <div className="flex flex-wrap gap-1">
              {quickChars.map((char) => (
                <Button
                  key={char}
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 min-w-8 px-2 text-base"
                  title={`${char} 삽입`}
                  aria-label={`${char} 삽입`}
                  disabled={!activeField}
                  onPointerDown={(event) => event.preventDefault()}
                  onClick={() => insertQuickChar(char)}
                >
                  {char}
                </Button>
              ))}
            </div>
          </div>
        )}
        <div className="flex-1 space-y-4 overflow-y-auto pr-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>다이아 ID *</Label>
              <Input
                placeholder="예: 대1"
                value={form.dia_id}
                onFocus={(e) => handleInputFocus("dia_id", e.currentTarget)}
                onChange={(e) => update("dia_id", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>타입명 *</Label>
              <Input
                placeholder="예: 평일"
                value={form.type_name}
                onFocus={(e) => handleInputFocus("type_name", e.currentTarget)}
                onChange={(e) => update("type_name", e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>출근시간</Label>
              <Input
                placeholder="예: 05:00"
                value={form.work_time}
                onFocus={(e) => handleInputFocus("work_time", e.currentTarget)}
                onChange={(e) => update("work_time", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>야간시간</Label>
              <Input
                placeholder="예: 07:00"
                value={form.night_time}
                onFocus={(e) => handleInputFocus("night_time", e.currentTarget)}
                onChange={(e) => update("night_time", e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>전반사업 시간</Label>
              <Input
                placeholder="예: 05:30"
                value={form.first_time}
                onFocus={(e) => handleInputFocus("first_time", e.currentTarget)}
                onChange={(e) => update("first_time", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>전반 열차번호</Label>
              <Input
                placeholder="예: 101"
                value={form.num_tr1}
                onFocus={(e) => handleInputFocus("num_tr1", e.currentTarget)}
                onChange={(e) => update("num_tr1", e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>후반사업 시간</Label>
              <Input
                placeholder="예: 13:30"
                value={form.second_time}
                onFocus={(e) => handleInputFocus("second_time", e.currentTarget)}
                onChange={(e) => update("second_time", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>후반 열차번호</Label>
              <Input
                placeholder="예: 201"
                value={form.num_tr2}
                onFocus={(e) => handleInputFocus("num_tr2", e.currentTarget)}
                onChange={(e) => update("num_tr2", e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>총 근무시간</Label>
              <div className="flex gap-1">
                <Input
                  placeholder="예: 08:00 또는 이미지 URL"
                  value={form.total_time}
                  onFocus={(e) =>
                    handleInputFocus("total_time", e.currentTarget)
                  }
                  onChange={(e) => update("total_time", e.target.value)}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  title="이미지 업로드"
                  disabled={uploadingField === "total_time"}
                  onClick={() => totalTimeFileRef.current?.click()}
                >
                  <ImageUp />
                </Button>
                <input
                  ref={totalTimeFileRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  hidden
                  onChange={(e) => {
                    handleImageUpload("total_time", e.target.files?.[0]);
                    e.target.value = "";
                  }}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>세 번째 시간 (선택)</Label>
              <div className="flex gap-1">
                <Input
                  placeholder="예: 21:30 또는 이미지 URL"
                  value={form.third_time}
                  onFocus={(e) =>
                    handleInputFocus("third_time", e.currentTarget)
                  }
                  onChange={(e) => update("third_time", e.target.value)}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  title="이미지 업로드"
                  disabled={uploadingField === "third_time"}
                  onClick={() => thirdTimeFileRef.current?.click()}
                >
                  <ImageUp />
                </Button>
                <input
                  ref={thirdTimeFileRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  hidden
                  onChange={(e) => {
                    handleImageUpload("third_time", e.target.files?.[0]);
                    e.target.value = "";
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <DialogFooter className="gap-2 border-t pt-4">
          <Button variant="outline" onClick={onClose}>
            취소
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "저장 중..." : "저장"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
