import { getSupabase } from "@/lib/supabase";
import * as api from "@/lib/api";
import type { Dia, DiaExtractionBatch, ExtractedDiaRow } from "@/types";

export function fileToBase64(
  file: File
): Promise<{ data: string; mime_type: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(",")[1] ?? "";
      resolve({ data: base64, mime_type: file.type });
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export async function extractDiaSchedule(
  officeName: string,
  files: File[]
): Promise<{ rows: ExtractedDiaRow[]; warning?: string }> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  const images = await Promise.all(files.map(fileToBase64));

  const res = await fetch(`${url}/functions/v1/extract-dia-schedule`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
      apikey: key,
    },
    body: JSON.stringify({ office_name: officeName, images }),
  });

  const data = await res.json();
  if (!data?.success) {
    throw new Error(data?.error || "근무표 인식에 실패했습니다.");
  }
  return { rows: data.rows ?? [], warning: data.warning };
}

export async function submitExtractionBatch(
  officeName: string,
  rows: ExtractedDiaRow[],
  warning?: string
): Promise<void> {
  const { error } = await getSupabase().from("dia_extraction_batch").insert({
    office_name: officeName,
    rows,
    warning: warning ?? null,
    status: "pending",
  });
  if (error) throw error;
}

export async function fetchPendingBatches(
  officeName: string
): Promise<DiaExtractionBatch[]> {
  const { data, error } = await getSupabase()
    .from("dia_extraction_batch")
    .select("*")
    .eq("office_name", officeName)
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data || []) as DiaExtractionBatch[];
}

export async function approveBatch(
  batch: DiaExtractionBatch,
  editedRows: ExtractedDiaRow[],
  officeCode: number,
  onProgress?: (done: number, total: number) => void
): Promise<{ successCount: number; errors: string[] }> {
  const errors: string[] = [];
  let successCount = 0;

  for (const [index, row] of editedRows.entries()) {
    try {
      const dia: Omit<Dia, "id"> = {
        dia_id: row.dia_id,
        type_name: row.type_name,
        office_name: batch.office_name,
        office_id: officeCode,
        work_time: row.work_time,
        first_time: row.first_time,
        second_time: row.second_time,
        third_time: row.third_time,
        total_time: row.total_time,
        num_tr1: row.num_tr1,
        num_tr2: row.num_tr2,
      };
      await api.createDia(dia);
      successCount++;
    } catch (e) {
      errors.push(
        `${row.dia_id || "(빈 행)"}: ${e instanceof Error ? e.message : String(e)}`
      );
    } finally {
      onProgress?.(index + 1, editedRows.length);
    }
  }

  const { error } = await getSupabase()
    .from("dia_extraction_batch")
    .update({
      status: "approved",
      reviewed_at: new Date().toISOString(),
      reviewed_note: errors.length > 0 ? errors.join("; ") : null,
    })
    .eq("id", batch.id);
  if (error) throw error;

  return { successCount, errors };
}

export async function rejectBatch(batchId: number): Promise<void> {
  const { error } = await getSupabase()
    .from("dia_extraction_batch")
    .update({ status: "rejected", reviewed_at: new Date().toISOString() })
    .eq("id", batchId);
  if (error) throw error;
}
