"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Container } from "@/components/layout/container";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { ArrowLeft, Download, FileJson, Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { JsonDropZone } from "@/components/json-editor/json-drop-zone";
import { OfficeFieldsSection } from "@/components/json-editor/office-fields-section";
import { DiaTable } from "@/components/json-editor/dia-table";
import { DiaFormDialog } from "@/components/json-editor/dia-form-dialog";
import type {
  DiaCalendarArrayField,
  DiaCalendarExport,
  DiaCalendarOffice,
  DiaCalendarRow,
} from "@/types";

export default function JsonEditorPage() {
  const router = useRouter();
  const [data, setData] = useState<DiaCalendarExport | null>(null);
  const [fileName, setFileName] = useState("");
  const [officeIndex, setOfficeIndex] = useState(0);
  const [search, setSearch] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [addingDia, setAddingDia] = useState(false);

  const office = data?.offices[officeIndex] ?? null;

  const filteredDias = useMemo(() => {
    if (!office) return [];
    const withIndex = office.dias.map((dia, index) => ({ dia, index }));
    if (!search) return withIndex;
    return withIndex.filter(({ dia }) =>
      dia.diaId?.toLowerCase().includes(search.toLowerCase())
    );
  }, [office, search]);

  const handleLoad = (loaded: DiaCalendarExport, name: string) => {
    setData(loaded);
    setFileName(name);
    setOfficeIndex(0);
    toast.success(`${name} 불러오기 완료 (승무소 ${loaded.offices.length}개)`);
  };

  const updateOffice = (updater: (office: DiaCalendarOffice) => DiaCalendarOffice) => {
    if (!data) return;
    setData({
      ...data,
      offices: data.offices.map((o, i) => (i === officeIndex ? updater(o) : o)),
    });
  };

  const handleArrayFieldSave = (field: DiaCalendarArrayField, values: string[]) => {
    updateOffice((o) => ({ ...o, [field]: values.join(",") }));
    toast.success("저장 완료! (다운로드 전까지는 파일에 반영되지 않습니다)");
  };

  const handleDiaSave = (row: DiaCalendarRow) => {
    updateOffice((o) => {
      const dias = [...o.dias];
      if (editingIndex !== null) {
        dias[editingIndex] = row;
      } else {
        dias.push(row);
      }
      return { ...o, dias };
    });
    toast.success(editingIndex !== null ? "수정 완료!" : "추가 완료!");
    setEditingIndex(null);
    setAddingDia(false);
  };

  const handleDiaDelete = (index: number) => {
    updateOffice((o) => ({ ...o, dias: o.dias.filter((_, i) => i !== index) }));
    toast.success("삭제 완료!");
  };

  const handleDownload = () => {
    if (!data) return;
    const exportData: DiaCalendarExport = {
      ...data,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName || "diacalendar.json";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("JSON 다운로드 완료!");
  };

  return (
    <div className="min-h-screen bg-background">
      <Container className="flex max-w-4xl flex-col gap-4 py-8">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" className="w-fit" onClick={() => router.push("/")}>
            <ArrowLeft className="mr-1 h-4 w-4" />
            로그인 화면으로
          </Button>
          {data && (
            <Button onClick={handleDownload}>
              <Download className="mr-1 h-4 w-4" />
              JSON 다운로드
            </Button>
          )}
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileJson className="h-5 w-5 text-primary" />
              <CardTitle>근무표 JSON 편집</CardTitle>
            </div>
            <CardDescription>
              diacalendar JSON 파일을 불러와 GUI로 편집한 뒤 다시 다운로드할 수 있습니다.
              서버로 전송되지 않으며, 브라우저 안에서만 처리됩니다.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!data ? (
              <JsonDropZone onLoad={handleLoad} />
            ) : (
              <div className="space-y-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  {data.offices.length > 1 ? (
                    <div className="w-full max-w-xs">
                      <Select
                        value={String(officeIndex)}
                        onValueChange={(v) => setOfficeIndex(Number(v))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {data.offices.map((o, i) => (
                            <SelectItem key={i} value={String(i)}>
                              {o.officeName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      승무소: <span className="font-medium text-foreground">{office?.officeName}</span>
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">파일: {fileName}</p>
                </div>

                {office && (
                  <>
                    <OfficeFieldsSection office={office} onSave={handleArrayFieldSave} />

                    <div>
                      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div className="relative flex-1 sm:max-w-xs">
                          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="다이아 ID로 검색..."
                            className="pl-9"
                          />
                        </div>
                        <Button onClick={() => setAddingDia(true)}>
                          <Plus className="mr-1 h-4 w-4" />
                          다이아 추가
                        </Button>
                      </div>

                      {filteredDias.length === 0 ? (
                        <div className="rounded-lg border p-8 text-center text-muted-foreground">
                          등록된 다이아가 없습니다.
                        </div>
                      ) : (
                        <div className="rounded-lg border">
                          <DiaTable
                            dias={filteredDias.map((f) => f.dia)}
                            onEdit={(i) => setEditingIndex(filteredDias[i].index)}
                            onDelete={(i) => handleDiaDelete(filteredDias[i].index)}
                          />
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </Container>

      {(editingIndex !== null || addingDia) && office && (
        <DiaFormDialog
          dia={editingIndex !== null ? office.dias[editingIndex] : null}
          open
          onClose={() => {
            setEditingIndex(null);
            setAddingDia(false);
          }}
          onSave={handleDiaSave}
        />
      )}
    </div>
  );
}
