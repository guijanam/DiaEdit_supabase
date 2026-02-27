"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import * as api from "@/lib/api";
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
import { toast } from "sonner";
import type { Dia } from "@/types";

interface DiaTableProps {
  dias: Dia[];
  onEdit: (dia: Dia) => void;
}

export function DiaTable({ dias, onEdit }: DiaTableProps) {
  const { reloadData } = useAuth();
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (deleteId === null) return;
    setDeleting(true);
    try {
      await api.deleteDia(deleteId);
      toast.success("삭제 완료!");
      await reloadData();
    } catch (e) {
      toast.error(`삭제 실패: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  return (
    <>
      {/* 모바일 카드 뷰 */}
      <div className="block divide-y md:hidden">
        {dias.map((dia) => (
          <div key={dia.id} className="p-3 hover:bg-muted/50">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold">{dia.dia_id}</span>
                <Badge variant="secondary" className="text-xs">
                  {dia.type_name}
                </Badge>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={() => onEdit(dia)}
                >
                  <Pencil className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="xs"
                  className="text-destructive"
                  onClick={() => setDeleteId(dia.id!)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>

            <div className="mb-2 rounded-lg bg-muted p-2">
              <div className="flex items-center gap-4 text-sm">
                {dia.work_time && (
                  <div>
                    <span className="text-xs text-muted-foreground">출근</span>
                    <span className="ml-1 font-semibold">{dia.work_time}</span>
                  </div>
                )}
                {dia.total_time && (
                  <div>
                    <span className="text-xs text-muted-foreground">총근무</span>
                    <span className="ml-1 font-semibold">{dia.total_time}</span>
                  </div>
                )}
              </div>
            </div>

            {dia.first_time && (
              <div className="mb-1 flex items-center justify-between rounded-lg bg-blue-50 p-2 dark:bg-blue-950">
                <span className="text-xs font-medium text-blue-600 dark:text-blue-400">전반사업</span>
                <span className="font-semibold">{dia.first_time}</span>
              </div>
            )}
            {dia.num_tr1 && (
              <div className="mb-2 flex items-center justify-between rounded-lg bg-blue-50 p-2 dark:bg-blue-950">
                <span className="text-xs font-medium text-blue-600 dark:text-blue-400">전반 열번</span>
                <span className="font-semibold">{dia.num_tr1}</span>
              </div>
            )}
            {dia.second_time && (
              <div className="mb-1 flex items-center justify-between rounded-lg bg-green-50 p-2 dark:bg-green-950">
                <span className="text-xs font-medium text-green-600 dark:text-green-400">후반사업</span>
                <span className="font-semibold">{dia.second_time}</span>
              </div>
            )}
            {dia.num_tr2 && (
              <div className="mb-2 flex items-center justify-between rounded-lg bg-green-50 p-2 dark:bg-green-950">
                <span className="text-xs font-medium text-green-600 dark:text-green-400">후반 열번</span>
                <span className="font-semibold">{dia.num_tr2}</span>
              </div>
            )}
            {dia.third_time && (
              <div className="flex items-center justify-between rounded-lg bg-purple-50 p-2 dark:bg-purple-950">
                <span className="text-xs font-medium text-purple-600 dark:text-purple-400">세 번째</span>
                <span className="font-semibold">{dia.third_time}</span>
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
              <TableHead>총근무</TableHead>
              <TableHead className="text-right">관리</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dias.map((dia) => (
              <TableRow key={dia.id}>
                <TableCell className="font-medium">{dia.dia_id}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="text-xs">
                    {dia.type_name}
                  </Badge>
                </TableCell>
                <TableCell>{dia.work_time || "-"}</TableCell>
                <TableCell>
                  {dia.first_time || "-"}
                  {dia.num_tr1 && (
                    <div className="text-xs text-muted-foreground">
                      ({dia.num_tr1})
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  {dia.second_time || "-"}
                  {dia.num_tr2 && (
                    <div className="text-xs text-muted-foreground">
                      ({dia.num_tr2})
                    </div>
                  )}
                </TableCell>
                <TableCell>{dia.total_time || "-"}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(dia)}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive"
                    onClick={() => setDeleteId(dia.id!)}
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
        open={deleteId !== null}
        onOpenChange={(v) => !v && setDeleteId(null)}
        title="다이아 삭제"
        description="이 다이아를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
        onConfirm={handleDelete}
        confirmText={deleting ? "삭제 중..." : "삭제"}
        variant="destructive"
      />
    </>
  );
}
