"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { X, Plus, CornerDownRight, Copy } from "lucide-react";
import { ConfirmDialog } from "@/components/composite/confirm-dialog";
import type { DiaCalendarArrayField, DiaCalendarOffice } from "@/types";

const FIELD_LABELS: Record<DiaCalendarArrayField, string> = {
  diaTurns1: "기관사",
  diaTurns2: "차장",
  diaTurns3: "운휴",
  subTurns: "4조2교대(예비)",
  diaSelects: "교번선택",
};

const FIELD_COLORS: Record<DiaCalendarArrayField, string> = {
  diaTurns1: "bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800 text-blue-600 dark:text-blue-400",
  diaTurns2: "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800 text-green-600 dark:text-green-400",
  diaTurns3: "bg-purple-50 border-purple-200 dark:bg-purple-950 dark:border-purple-800 text-purple-600 dark:text-purple-400",
  subTurns: "bg-orange-50 border-orange-200 dark:bg-orange-950 dark:border-orange-800 text-orange-600 dark:text-orange-400",
  diaSelects: "bg-indigo-50 border-indigo-200 dark:bg-indigo-950 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400",
};

// 기관사↔차장 교번순서는 서로 같거나 거의 같은 경우가 많아 불러오기(복사)를 허용
const COPY_SOURCE: Partial<Record<DiaCalendarArrayField, DiaCalendarArrayField>> = {
  diaTurns1: "diaTurns2",
  diaTurns2: "diaTurns1",
};

function parseCsv(value: string): string[] {
  return value === "" ? [] : value.split(",");
}

interface ArrayFieldEditorProps {
  office: DiaCalendarOffice;
  field: DiaCalendarArrayField;
  open: boolean;
  onClose: () => void;
  onSave: (field: DiaCalendarArrayField, values: string[]) => void;
}

export function ArrayFieldEditor({
  office,
  field,
  open,
  onClose,
  onSave,
}: ArrayFieldEditorProps) {
  const [items, setItems] = useState<string[]>(() => parseCsv(office[field]));
  const [confirmCopy, setConfirmCopy] = useState(false);

  const sourceField = COPY_SOURCE[field];

  const applyCopy = () => {
    if (!sourceField) return;
    setItems(parseCsv(office[sourceField]));
    setConfirmCopy(false);
  };

  const updateItem = (index: number, value: string) => {
    const next = [...items];
    next[index] = value;
    setItems(next);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const addItem = () => {
    setItems([...items, ""]);
  };

  const insertItemAfter = (index: number) => {
    const next = [...items];
    next.splice(index + 1, 0, "");
    setItems(next);
  };

  const handleSave = () => {
    const filtered = items.filter((s) => s.trim() !== "");
    onSave(field, filtered);
    onClose();
  };

  const colorClass = FIELD_COLORS[field];

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent
        className="max-h-[85vh] max-w-2xl overflow-hidden flex flex-col"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        showCloseButton={false}
      >
        <DialogHeader>
          <div className="flex items-center justify-between gap-2 pr-6">
            <DialogTitle>{FIELD_LABELS[field]} 수정</DialogTitle>
            {sourceField && (
              <Button variant="outline" size="sm" onClick={() => setConfirmCopy(true)}>
                <Copy className="mr-1 h-3.5 w-3.5" />
                {FIELD_LABELS[sourceField]} 교번 불러오기
              </Button>
            )}
          </div>
        </DialogHeader>
        <div className="flex-1 space-y-3 overflow-y-auto pr-2">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {items.map((item, index) => (
              <div
                key={index}
                className={`flex items-center gap-0.5 rounded-lg border pl-2 pr-0.5 py-1 ${colorClass}`}
              >
                <span className="shrink-0 text-xs font-semibold">{index + 1}.</span>
                <Input
                  value={item}
                  onChange={(e) => updateItem(index, e.target.value)}
                  className="h-7 min-w-0 flex-1 border-0 bg-transparent px-0.5 text-sm shadow-none focus-visible:ring-0"
                />
                <button
                  onClick={() => insertItemAfter(index)}
                  className="shrink-0 p-1.5 opacity-70 hover:opacity-100"
                  title="아래에 추가"
                  type="button"
                >
                  <CornerDownRight className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => removeItem(index)}
                  className="shrink-0 p-1.5 text-destructive hover:text-destructive/80"
                  title="삭제"
                  type="button"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full border-dashed" onClick={addItem}>
            <Plus className="mr-1 h-4 w-4" />
            항목 추가
          </Button>
        </div>
        <DialogFooter className="gap-2 border-t pt-4">
          <Button variant="outline" onClick={onClose}>
            취소
          </Button>
          <Button onClick={handleSave}>저장</Button>
        </DialogFooter>
      </DialogContent>

      {sourceField && (
        <ConfirmDialog
          open={confirmCopy}
          onOpenChange={setConfirmCopy}
          title="교번 불러오기"
          description={`현재 편집 중인 목록을 ${FIELD_LABELS[sourceField]} 교번순서로 전체 교체합니다. 저장 전 편집 내용은 사라집니다.`}
          onConfirm={applyCopy}
          confirmText="불러오기"
        />
      )}
    </Dialog>
  );
}
