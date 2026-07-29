import { getSupabase } from "@/lib/supabase";

const BUCKET = "dia-images";
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE_MB = 10;

export function validateDiaImage(file: File): string | null {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    return "이미지 파일(jpg/png/webp)만 업로드할 수 있습니다.";
  }
  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    return `파일 크기는 ${MAX_SIZE_MB}MB 이하만 가능합니다.`;
  }
  return null;
}

export async function uploadDiaImage(
  file: File,
  officeCode: number,
  field: "total_time" | "third_time"
): Promise<string> {
  const error = validateDiaImage(file);
  if (error) throw new Error(error);

  const supabase = getSupabase();
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${officeCode}/${field}_${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { upsert: true, contentType: file.type });
  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
