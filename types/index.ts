export interface Office {
  office_name: string;
  office_code: number;
  dia_turns1: string[];
  dia_turns2: string[];
  dia_turns3: string[];
  sub_turns: string[];
  dia_selects: string[];
  dia_updated_at: string | null;
}

export interface Dia {
  id?: number;
  dia_id: string;
  type_name: string;
  office_name: string;
  office_id: number;
  work_time: string;
  first_time: string;
  second_time: string;
  third_time: string;
  total_time: string;
  num_tr1: string;
  num_tr2: string;
}

export type OfficeArrayField =
  | "dia_turns1"
  | "dia_turns2"
  | "dia_turns3"
  | "sub_turns"
  | "dia_selects";

export interface ExtractedDiaRow {
  dia_id: string;
  type_name: string;
  work_time: string;
  first_time: string;
  second_time: string;
  third_time: string;
  total_time: string;
  num_tr1: string;
  num_tr2: string;
  _confidence?: "high" | "low";
}

export interface DiaExtractionBatch {
  id: number;
  office_name: string;
  status: "pending" | "approved" | "rejected";
  rows: ExtractedDiaRow[];
  warning: string | null;
  created_at: string;
  reviewed_at: string | null;
}

export interface DiaCalendarRow {
  diaId: string;
  typeName: string;
  workTime: string | null;
  firstTime: string | null;
  numTr1: string | null;
  secondTime: string | null;
  numTr2: string | null;
  thirdTime: string | null;
  totalTime: string | null;
}

export interface DiaCalendarOffice {
  officeName: string;
  diaTurns1: string;
  diaTurns2: string;
  diaTurns3: string;
  subTurns: string;
  diaSelects: string;
  createdAt: number;
  dias: DiaCalendarRow[];
}

export interface DiaCalendarExport {
  version: number;
  exportedAt: string;
  offices: DiaCalendarOffice[];
}

export type DiaCalendarArrayField =
  | "diaTurns1"
  | "diaTurns2"
  | "diaTurns3"
  | "subTurns"
  | "diaSelects";

