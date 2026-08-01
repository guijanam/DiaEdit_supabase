"use client";

import { useState } from "react";
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
import type { DiaCalendarRow } from "@/types";

interface DiaFormDialogProps {
  dia: Partial<DiaCalendarRow> | null;
  open: boolean;
  onClose: () => void;
  onSave: (row: DiaCalendarRow) => void;
}

export function DiaFormDialog({ dia, open, onClose, onSave }: DiaFormDialogProps) {
  const [form, setForm] = useState({
    diaId: dia?.diaId || "",
    typeName: dia?.typeName || "",
    workTime: dia?.workTime || "",
    firstTime: dia?.firstTime || "",
    numTr1: dia?.numTr1 || "",
    secondTime: dia?.secondTime || "",
    numTr2: dia?.numTr2 || "",
    totalTime: dia?.totalTime || "",
    thirdTime: dia?.thirdTime || "",
  });

  const isEditing = !!dia;

  const update = (field: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSave = () => {
    if (!form.diaId || !form.typeName) return;
    onSave({
      diaId: form.diaId,
      typeName: form.typeName,
      workTime: form.workTime || null,
      firstTime: form.firstTime || null,
      numTr1: form.numTr1 || null,
      secondTime: form.secondTime || null,
      numTr2: form.numTr2 || null,
      totalTime: form.totalTime || null,
      thirdTime: form.thirdTime || null,
    });
    onClose();
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
          <DialogTitle>{isEditing ? "다이아 수정" : "다이아 추가"}</DialogTitle>
        </DialogHeader>
        <div className="flex-1 space-y-4 overflow-y-auto pr-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>다이아 ID *</Label>
              <Input
                placeholder="예: 대1"
                value={form.diaId}
                onChange={(e) => update("diaId", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>타입명 *</Label>
              <Input
                placeholder="예: 평일"
                value={form.typeName}
                onChange={(e) => update("typeName", e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>출근시간</Label>
            <Input
              placeholder="예: 06:24"
              value={form.workTime}
              onChange={(e) => update("workTime", e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>전반사업 시간</Label>
              <Input
                placeholder="예: 06:54-09:46"
                value={form.firstTime}
                onChange={(e) => update("firstTime", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>전반 열차번호</Label>
              <Input
                placeholder="예: (57)2043 2077 1927"
                value={form.numTr1}
                onChange={(e) => update("numTr1", e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>후반사업 시간</Label>
              <Input
                placeholder="예: 13:41-15:11"
                value={form.secondTime}
                onChange={(e) => update("secondTime", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>후반 열차번호</Label>
              <Input
                placeholder="예: (19)2205 2243(16)"
                value={form.numTr2}
                onChange={(e) => update("numTr2", e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>총 근무시간</Label>
              <Input
                placeholder="예: 09:32"
                value={form.totalTime}
                onChange={(e) => update("totalTime", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>세 번째 시간 (선택)</Label>
              <Input
                placeholder="예: 21:30"
                value={form.thirdTime}
                onChange={(e) => update("thirdTime", e.target.value)}
              />
            </div>
          </div>
        </div>
        <DialogFooter className="gap-2 border-t pt-4">
          <Button variant="outline" onClick={onClose}>
            취소
          </Button>
          <Button onClick={handleSave} disabled={!form.diaId || !form.typeName}>
            저장
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
