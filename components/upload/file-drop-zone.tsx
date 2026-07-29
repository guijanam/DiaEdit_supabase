"use client";

import { useRef, useState } from "react";
import { X, Upload } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic"];
const MAX_FILES = 5;
const MAX_SIZE_MB = 10;

interface FileDropZoneProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
}

export function FileDropZone({ files, onFilesChange }: FileDropZoneProps) {
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = (incoming: FileList | File[]) => {
    const next: File[] = [...files];
    for (const file of Array.from(incoming)) {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        toast.error(`${file.name}: 이미지 파일(jpg/png/webp/heic)만 업로드할 수 있습니다.`);
        continue;
      }
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        toast.error(`${file.name}: 파일 크기는 ${MAX_SIZE_MB}MB 이하만 가능합니다.`);
        continue;
      }
      if (next.length >= MAX_FILES) {
        toast.error(`이미지는 최대 ${MAX_FILES}장까지 업로드할 수 있습니다.`);
        break;
      }
      next.push(file);
    }
    onFilesChange(next);
  };

  const removeFile = (index: number) => {
    onFilesChange(files.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
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
          if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
        }}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-8 text-center transition",
          dragOver ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:bg-muted/50"
        )}
      >
        <Upload className="h-8 w-8 text-muted-foreground" />
        <p className="text-sm font-medium">근무표 사진을 선택하거나 드래그하세요</p>
        <p className="text-xs text-muted-foreground">
          jpg/png/webp/heic, 장당 {MAX_SIZE_MB}MB 이하, 최대 {MAX_FILES}장
        </p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ACCEPTED_TYPES.join(",")}
          hidden
          onChange={(e) => {
            if (e.target.files?.length) addFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {files.length > 0 && (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {files.map((file, index) => (
            <div key={index} className="group relative aspect-square overflow-hidden rounded-lg border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={URL.createObjectURL(file)}
                alt={file.name}
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white opacity-0 transition group-hover:opacity-100"
                title="삭제"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
