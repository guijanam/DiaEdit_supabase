"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import * as api from "@/lib/api";
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
import { toast } from "sonner";
import type { Dia } from "@/types";

interface DiaFormDialogProps {
  dia: Partial<Dia>;
  open: boolean;
  onClose: () => void;
}

export function DiaFormDialog({ dia, open, onClose }: DiaFormDialogProps) {
  const { officeName, officeInfo, reloadData } = useAuth();
  const [form, setForm] = useState({
    dia_id: dia.dia_id || "",
    type_name: dia.type_name || "",
    work_time: dia.work_time || "",
    first_time: dia.first_time || "",
    num_tr1: dia.num_tr1 || "",
    second_time: dia.second_time || "",
    num_tr2: dia.num_tr2 || "",
    total_time: dia.total_time || "",
    third_time: dia.third_time || "",
  });
  const [saving, setSaving] = useState(false);

  const isEditing = !!dia.id;

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

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
        office_id: officeInfo?.office_id ?? 0,
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
        <div className="flex-1 space-y-4 overflow-y-auto pr-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>다이아 ID *</Label>
              <Input
                placeholder="예: 대1"
                value={form.dia_id}
                onChange={(e) => update("dia_id", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>타입명 *</Label>
              <Input
                placeholder="예: 평일"
                value={form.type_name}
                onChange={(e) => update("type_name", e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>출근시간</Label>
            <Input
              placeholder="예: 05:00"
              value={form.work_time}
              onChange={(e) => update("work_time", e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>전반사업 시간</Label>
              <Input
                placeholder="예: 05:30"
                value={form.first_time}
                onChange={(e) => update("first_time", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>전반 열차번호</Label>
              <Input
                placeholder="예: 101"
                value={form.num_tr1}
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
                onChange={(e) => update("second_time", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>후반 열차번호</Label>
              <Input
                placeholder="예: 201"
                value={form.num_tr2}
                onChange={(e) => update("num_tr2", e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>총 근무시간</Label>
              <Input
                placeholder="예: 08:00"
                value={form.total_time}
                onChange={(e) => update("total_time", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>세 번째 시간 (선택)</Label>
              <Input
                placeholder="예: 21:30"
                value={form.third_time}
                onChange={(e) => update("third_time", e.target.value)}
              />
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
