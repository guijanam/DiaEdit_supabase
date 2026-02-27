"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import * as api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { X, Plus } from "lucide-react";
import { toast } from "sonner";
import type { OfficeArrayField } from "@/types";

const FIELD_LABELS: Record<OfficeArrayField, string> = {
  dia_turns1: "기관사",
  dia_turns2: "차장",
  dia_turns3: "운휴",
  sub_turns: "4조2교대(예비)",
  dia_selects: "교번선택",
};

const FIELD_COLORS: Record<OfficeArrayField, string> = {
  dia_turns1: "bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800 text-blue-600 dark:text-blue-400",
  dia_turns2: "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800 text-green-600 dark:text-green-400",
  dia_turns3: "bg-purple-50 border-purple-200 dark:bg-purple-950 dark:border-purple-800 text-purple-600 dark:text-purple-400",
  sub_turns: "bg-orange-50 border-orange-200 dark:bg-orange-950 dark:border-orange-800 text-orange-600 dark:text-orange-400",
  dia_selects: "bg-indigo-50 border-indigo-200 dark:bg-indigo-950 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400",
};

interface ArrayFieldEditorProps {
  field: OfficeArrayField;
  open: boolean;
  onClose: () => void;
}

export function ArrayFieldEditor({
  field,
  open,
  onClose,
}: ArrayFieldEditorProps) {
  const { officeInfo, officeName, reloadData } = useAuth();
  const [items, setItems] = useState<string[]>(
    () => [...(officeInfo?.[field] || [])]
  );
  const [saving, setSaving] = useState(false);

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

  const handleSave = async () => {
    setSaving(true);
    try {
      const filtered = items.filter((s) => s.trim() !== "");
      await api.updateOfficeField(officeName, field, filtered);
      toast.success("저장 완료!");
      await reloadData();
      onClose();
    } catch (e) {
      toast.error(`저장 실패: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setSaving(false);
    }
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
          <DialogTitle>{FIELD_LABELS[field]} 수정</DialogTitle>
        </DialogHeader>
        <div className="flex-1 space-y-3 overflow-y-auto pr-2">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
            {items.map((item, index) => (
              <div
                key={index}
                className={`flex items-center gap-1 rounded-lg border px-3 py-2 ${colorClass}`}
              >
                <span className="text-sm font-semibold">{index + 1}.</span>
                <Input
                  value={item}
                  onChange={(e) => updateItem(index, e.target.value)}
                  className="h-7 flex-1 border-0 bg-transparent px-1 text-sm shadow-none focus-visible:ring-0"
                />
                <button
                  onClick={() => removeItem(index)}
                  className="text-destructive hover:text-destructive/80"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
          <Button
            variant="outline"
            className="w-full border-dashed"
            onClick={addItem}
          >
            <Plus className="mr-1 h-4 w-4" />
            항목 추가
          </Button>
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
