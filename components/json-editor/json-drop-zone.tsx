"use client";

import { useRef, useState } from "react";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { DiaCalendarExport } from "@/types";

interface JsonDropZoneProps {
  onLoad: (data: DiaCalendarExport, fileName: string) => void;
}

export function JsonDropZone({ onLoad }: JsonDropZoneProps) {
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const loadFile = async (file: File) => {
    if (!file.name.toLowerCase().endsWith(".json")) {
      toast.error("JSON 파일만 업로드할 수 있습니다.");
      return;
    }
    try {
      const text = await file.text();
      const data = JSON.parse(text) as DiaCalendarExport;
      if (!Array.isArray(data.offices)) {
        toast.error("올바른 근무표 JSON 형식이 아닙니다. (offices 배열 없음)");
        return;
      }
      onLoad(data, file.name);
    } catch (e) {
      toast.error(`파일을 읽을 수 없습니다: ${e instanceof Error ? e.message : String(e)}`);
    }
  };

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files?.[0];
        if (file) loadFile(file);
      }}
      className={cn(
        "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-10 text-center transition",
        dragOver ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:bg-muted/50"
      )}
    >
      <Upload className="h-8 w-8 text-muted-foreground" />
      <p className="text-sm font-medium">diacalendar JSON 파일을 선택하거나 드래그하세요</p>
      <p className="text-xs text-muted-foreground">예: diacalendar_20260801.json</p>
      <input
        ref={inputRef}
        type="file"
        accept=".json,application/json"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) loadFile(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}
