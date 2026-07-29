-- ============================================================
-- dia_extraction_batch: 근무표 사진 자동 업로드 → AI 추출 대기함
-- ------------------------------------------------------------
-- 비로그인 사용자가 /upload에서 근무표 사진을 올리면 AI가 추출한
-- 결과가 이 테이블에 status='pending'으로 저장된다. 실제 dia
-- 테이블 반영은 로그인한 승무소 관리자가 대시보드 "자동추출 대기함"
-- 탭에서 검토 후 승인해야만 이루어진다.
--
-- 이 앱은 Supabase Auth를 쓰지 않고 anon key로만 접근하므로(office/dia
-- 테이블과 동일한 보안 모델), RLS는 anon 역할에 CRUD를 열어두고
-- "로그인한 관리자만 승인 가능"은 프론트엔드에서 강제한다.
--
-- Supabase Dashboard > SQL Editor 에 붙여넣어 실행.
-- ============================================================

create table if not exists public.dia_extraction_batch (
  id bigint generated always as identity primary key,
  office_name text not null references public.office(office_name),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  rows jsonb not null,
  warning text,
  created_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_note text
);

create index if not exists dia_extraction_batch_office_status_idx
  on public.dia_extraction_batch (office_name, status);

alter table public.dia_extraction_batch enable row level security;

drop policy if exists "anon_insert_dia_extraction_batch" on public.dia_extraction_batch;
drop policy if exists "anon_select_dia_extraction_batch" on public.dia_extraction_batch;
drop policy if exists "anon_update_dia_extraction_batch" on public.dia_extraction_batch;

create policy "anon_insert_dia_extraction_batch"
  on public.dia_extraction_batch
  for insert
  to anon
  with check (true);

create policy "anon_select_dia_extraction_batch"
  on public.dia_extraction_batch
  for select
  to anon
  using (true);

create policy "anon_update_dia_extraction_batch"
  on public.dia_extraction_batch
  for update
  to anon
  using (true)
  with check (true);
