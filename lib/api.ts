import { getSupabase } from "@/lib/supabase";
import { parsePostgresArray, toPostgresArray } from "@/lib/utils";
import type { Office, Dia, OfficeArrayField } from "@/types";

export async function fetchOfficeList(): Promise<string[]> {
  const { data, error } = await getSupabase()
    .from("office")
    .select("office_name")
    .order("office_name");

  if (error) throw error;
  return (data || []).map((o) => o.office_name);
}

export async function fetchOfficeInfo(
  officeName: string
): Promise<Office | null> {
  const { data, error } = await getSupabase()
    .from("office")
    .select("*")
    .eq("office_name", officeName)
    .single();

  if (error) throw error;
  if (!data) return null;

  return {
    ...data,
    dia_turns1: parsePostgresArray(data.dia_turns1),
    dia_turns2: parsePostgresArray(data.dia_turns2),
    dia_turns3: parsePostgresArray(data.dia_turns3),
    sub_turns: parsePostgresArray(data.sub_turns),
    dia_selects: parsePostgresArray(data.dia_selects),
  } as Office;
}

export async function updateOfficeField(
  officeName: string,
  field: OfficeArrayField,
  values: string[]
) {
  const { error } = await getSupabase()
    .from("office")
    .update({ [field]: toPostgresArray(values) })
    .eq("office_name", officeName);

  if (error) throw error;
}

export async function fetchDias(officeName: string): Promise<Dia[]> {
  const { data, error } = await getSupabase()
    .from("dia")
    .select("*")
    .eq("office_name", officeName)
    .order("id");

  if (error) throw error;
  return (data || []) as Dia[];
}

export async function createDia(dia: Omit<Dia, "id">) {
  const { error } = await getSupabase().from("dia").insert(dia);
  if (error) throw error;
}

export async function updateDia(id: number, dia: Partial<Dia>) {
  const {
    id: _,
    office_name: _on,
    office_id: _oi,
    ...updateData
  } = dia as Dia;
  const { error } = await getSupabase()
    .from("dia")
    .update(updateData)
    .eq("id", id);
  if (error) throw error;
}

export async function deleteDia(id: number) {
  const { error } = await getSupabase().from("dia").delete().eq("id", id);
  if (error) throw error;
}

export async function authenticate(
  officeName: string,
  password: string
): Promise<boolean> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  const res = await fetch(`${url}/functions/v1/authenticate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
      apikey: key,
    },
    body: JSON.stringify({ office_name: officeName, password }),
  });

  const data = await res.json();
  return data?.success === true;
}
