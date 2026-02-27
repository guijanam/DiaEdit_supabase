"use client";

import { useState, useMemo } from "react";
import { useAuth } from "@/lib/auth-context";
import { naturalSort } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search } from "lucide-react";
import { DiaTable } from "@/components/dashboard/dia-table";
import { DiaFormDialog } from "@/components/dashboard/dia-form-dialog";
import type { Dia } from "@/types";

export function DiaManagementTab() {
  const { dias, officeName } = useAuth();
  const [diaTypeTab, setDiaTypeTab] = useState("all");
  const [search, setSearch] = useState("");
  const [editingDia, setEditingDia] = useState<Partial<Dia> | null>(null);

  const diaTypes = useMemo(
    () => ["all", ...new Set(dias.map((d) => d.type_name).filter(Boolean))],
    [dias]
  );

  const filteredDias = useMemo(() => {
    let result = diaTypeTab === "all"
      ? dias
      : dias.filter((d) => d.type_name === diaTypeTab);
    if (search) {
      result = result.filter((d) =>
        d.dia_id?.toLowerCase().includes(search.toLowerCase())
      );
    }
    return [...result].sort(naturalSort);
  }, [dias, diaTypeTab, search]);

  const handleAdd = () => {
    setEditingDia({
      office_name: officeName,
      type_name: diaTypeTab === "all" ? "" : diaTypeTab,
    });
  };

  return (
    <div>
      {/* 타입 서브탭 */}
      <div className="overflow-x-auto border-b bg-muted/50 px-2 pt-4 md:px-4">
        <div className="flex min-w-max gap-2">
          {diaTypes.map((type) => {
            const count =
              type === "all"
                ? dias.length
                : dias.filter((d) => d.type_name === type).length;
            const isActive = diaTypeTab === type;
            return (
              <button
                key={type}
                onClick={() => setDiaTypeTab(type)}
                className={`whitespace-nowrap rounded-t-lg px-3 py-2 text-sm font-medium transition md:px-4 md:text-base ${
                  isActive
                    ? "border-t-2 border-primary bg-background text-primary"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                {type === "all" ? "전체" : type}
                <Badge
                  variant="secondary"
                  className="ml-1.5 px-1.5 py-0 text-xs"
                >
                  {count}
                </Badge>
              </button>
            );
          })}
        </div>
      </div>

      {/* 검색 + 추가 */}
      <div className="flex flex-col gap-2 border-b bg-muted/50 p-2 md:flex-row md:gap-4 md:p-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="다이아 ID로 검색..."
            className="pl-9"
          />
        </div>
        <Button onClick={handleAdd}>
          <Plus className="mr-1 h-4 w-4" />
          추가
        </Button>
      </div>

      {/* 테이블 */}
      {filteredDias.length === 0 ? (
        <div className="p-8 text-center text-muted-foreground">
          등록된 다이아가 없습니다.
        </div>
      ) : (
        <DiaTable dias={filteredDias} onEdit={setEditingDia} />
      )}

      {/* 폼 다이얼로그 */}
      {editingDia && (
        <DiaFormDialog
          dia={editingDia}
          open={!!editingDia}
          onClose={() => setEditingDia(null)}
        />
      )}
    </div>
  );
}
