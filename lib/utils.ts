import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function parsePostgresArray(value: unknown): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    return value
      .replace(/^\{/, "")
      .replace(/\}$/, "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}

export function toPostgresArray(values: string[]): string {
  return `{${values.join(",")}}`;
}

export function naturalSort(a: { dia_id?: string }, b: { dia_id?: string }) {
  const aDiaId = a.dia_id || "";
  const bDiaId = b.dia_id || "";

  const splitId = (str: string) => {
    const match = str.match(/^([가-힣]*)(\d+)$/);
    if (match) {
      return { text: match[1], num: parseInt(match[2], 10) };
    }
    const numMatch = str.match(/^(\d+)$/);
    if (numMatch) {
      return { text: "", num: parseInt(numMatch[1], 10) };
    }
    return { text: str, num: 0 };
  };

  const aParts = splitId(aDiaId);
  const bParts = splitId(bDiaId);

  if (aParts.text !== bParts.text) {
    if (!aParts.text) return -1;
    if (!bParts.text) return 1;
    return aParts.text.localeCompare(bParts.text);
  }

  return aParts.num - bParts.num;
}
