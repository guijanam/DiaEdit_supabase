"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { ConfirmDialog } from "@/components/composite/confirm-dialog";
import { Pencil, Trash2 } from "lucide-react";
import type { DiaCalendarRow } from "@/types";

interface DiaTableProps {
  dias: DiaCalendarRow[];
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
}

export function DiaTable({ dias, onEdit, onDelete }: DiaTableProps) {
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  const handleDelete = () => {
    if (deleteIndex === null) return;
    onDelete(deleteIndex);
    setDeleteIndex(null);
  };

  return (
    <>
      {/* 모바일 카드 뷰 */}
      <div className="block divide-y md:hidden">
        {dias.map((dia, index) => (
          <div key={index} className="p-3 hover:bg-muted/50">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold">{dia.diaId}</span>
                <Badge variant="secondary" className="text-xs">
                  {dia.typeName}
                </Badge>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="xs" onClick={() => onEdit(index)}>
                  <Pencil className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="xs"
                  className="text-destructive"
                  onClick={() => setDeleteIndex(index)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>

            <div className="mb-2 rounded-lg bg-muted p-2">
              <div className="flex items-center gap-4 text-sm">
                {dia.workTime && (
                  <div>
                    <span className="text-xs text-muted-foreground">출근</span>
                    <span className="ml-1 font-semibold">{dia.workTime}</span>
                  </div>
                )}
                {dia.totalTime && (
                  <div>
                    <span className="text-xs text-muted-foreground">총근무</span>
                    <span className="ml-1 font-semibold">{dia.totalTime}</span>
                  </div>
                )}
              </div>
            </div>

            {dia.firstTime && (
              <div className="mb-1 flex items-center justify-between rounded-lg bg-blue-50 p-2 dark:bg-blue-950">
                <span className="text-xs font-medium text-blue-600 dark:text-blue-400">전반사업</span>
                <span className="font-semibold">{dia.firstTime}</span>
              </div>
            )}
            {dia.numTr1 && (
              <div className="mb-2 flex items-center justify-between rounded-lg bg-blue-50 p-2 dark:bg-blue-950">
                <span className="text-xs font-medium text-blue-600 dark:text-blue-400">전반 열번</span>
                <span className="font-semibold">{dia.numTr1}</span>
              </div>
            )}
            {dia.secondTime && (
              <div className="mb-1 flex items-center justify-between rounded-lg bg-green-50 p-2 dark:bg-green-950">
                <span className="text-xs font-medium text-green-600 dark:text-green-400">후반사업</span>
                <span className="font-semibold">{dia.secondTime}</span>
              </div>
            )}
            {dia.numTr2 && (
              <div className="mb-2 flex items-center justify-between rounded-lg bg-green-50 p-2 dark:bg-green-950">
                <span className="text-xs font-medium text-green-600 dark:text-green-400">후반 열번</span>
                <span className="font-semibold">{dia.numTr2}</span>
              </div>
            )}
            {dia.thirdTime && (
              <div className="flex items-center justify-between rounded-lg bg-purple-50 p-2 dark:bg-purple-950">
                <span className="text-xs font-medium text-purple-600 dark:text-purple-400">세 번째</span>
                <span className="font-semibold">{dia.thirdTime}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 데스크탑 테이블 뷰 */}
      <div className="hidden overflow-x-auto md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>다이아ID</TableHead>
              <TableHead>타입</TableHead>
              <TableHead>출근시간</TableHead>
              <TableHead>전반사업</TableHead>
              <TableHead>후반사업</TableHead>
              <TableHead>세 번째</TableHead>
              <TableHead>총근무</TableHead>
              <TableHead className="text-right">관리</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dias.map((dia, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{dia.diaId}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="text-xs">
                    {dia.typeName}
                  </Badge>
                </TableCell>
                <TableCell>{dia.workTime || "-"}</TableCell>
                <TableCell>
                  {dia.firstTime || "-"}
                  {dia.numTr1 && (
                    <div className="text-xs text-muted-foreground">({dia.numTr1})</div>
                  )}
                </TableCell>
                <TableCell>
                  {dia.secondTime || "-"}
                  {dia.numTr2 && (
                    <div className="text-xs text-muted-foreground">({dia.numTr2})</div>
                  )}
                </TableCell>
                <TableCell>{dia.thirdTime || "-"}</TableCell>
                <TableCell>{dia.totalTime || "-"}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => onEdit(index)}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive"
                    onClick={() => setDeleteIndex(index)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ConfirmDialog
        open={deleteIndex !== null}
        onOpenChange={(v) => !v && setDeleteIndex(null)}
        title="다이아 삭제"
        description="이 다이아를 삭제하시겠습니까? 저장(다운로드) 전까지는 되돌릴 수 있습니다."
        onConfirm={handleDelete}
        confirmText="삭제"
        variant="destructive"
      />
    </>
  );
}
