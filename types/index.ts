export interface Office {
  office_name: string;
  office_id: number;
  office_code: string;
  dia_turns1: string[];
  dia_turns2: string[];
  dia_turns3: string[];
  sub_turns: string[];
  dia_selects: string[];
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

