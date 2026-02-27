"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { ArrayFieldEditor } from "@/components/dashboard/array-field-editor";
import type { OfficeArrayField } from "@/types";

const FIELD_CONFIG: {
  field: OfficeArrayField;
  label: string;
  color: string;
  badgeColor: string;
}[] = [
  {
    field: "dia_turns1",
    label: "기관사",
    color: "bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800",
    badgeColor: "text-blue-600 dark:text-blue-400",
  },
  {
    field: "dia_turns2",
    label: "차장",
    color: "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800",
    badgeColor: "text-green-600 dark:text-green-400",
  },
  {
    field: "dia_turns3",
    label: "운휴",
    color: "bg-purple-50 border-purple-200 dark:bg-purple-950 dark:border-purple-800",
    badgeColor: "text-purple-600 dark:text-purple-400",
  },
  {
    field: "sub_turns",
    label: "4조2교대(예비)",
    color: "bg-orange-50 border-orange-200 dark:bg-orange-950 dark:border-orange-800",
    badgeColor: "text-orange-600 dark:text-orange-400",
  },
  {
    field: "dia_selects",
    label: "교번선택",
    color: "bg-indigo-50 border-indigo-200 dark:bg-indigo-950 dark:border-indigo-800",
    badgeColor: "text-indigo-600 dark:text-indigo-400",
  },
];

export function OfficeInfoTab() {
  const { officeInfo } = useAuth();
  const [editingField, setEditingField] = useState<OfficeArrayField | null>(
    null
  );

  if (!officeInfo) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">승무소 기본 정보</h2>

      <div className="rounded-lg bg-muted p-4">
        <p className="text-sm text-muted-foreground">승무소명</p>
        <p className="text-lg font-semibold">{officeInfo.office_name}</p>
      </div>

      {FIELD_CONFIG.map(({ field, label, color, badgeColor }) => (
        <div key={field} className="flex items-start justify-between gap-4 rounded-lg border p-4">
          <div className="flex-1">
            <p className="mb-2 text-sm text-muted-foreground">{label}</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {officeInfo[field]?.length > 0 ? (
                officeInfo[field].map((item, index) => (
                  <div
                    key={index}
                    className={`rounded-lg border px-3 py-2 text-sm font-medium ${color}`}
                  >
                    <span className={`font-semibold ${badgeColor}`}>
                      {index + 1}.
                    </span>{" "}
                    {item}
                  </div>
                ))
              ) : (
                <span className="text-sm text-muted-foreground">-</span>
              )}
            </div>
          </div>
          <Button
            size="sm"
            onClick={() => setEditingField(field)}
            className="flex-shrink-0"
          >
            <Pencil className="mr-1 h-3 w-3" />
            수정
          </Button>
        </div>
      ))}

      {editingField && (
        <ArrayFieldEditor
          field={editingField}
          open={!!editingField}
          onClose={() => setEditingField(null)}
        />
      )}
    </div>
  );
}
