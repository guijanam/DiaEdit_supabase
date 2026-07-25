-- ============================================================
-- office 테이블에 dia_updated_at 컬럼 추가
-- ------------------------------------------------------------
-- 각 승무소의 근무표(dia)가 마지막으로 수정된 시각을 승무소 단위로
-- 저장한다. 다이아 추가/수정/삭제 시 앱에서 이 값을 현재 시각으로
-- 갱신한다 (lib/api.ts 의 touchOfficeDiaUpdatedAt).
--
-- - nullable: 아직 한 번도 수정하지 않은 승무소는 null → UI에서
--   "기록 없음"으로 표시한다.
-- - 기존 RLS 정책(anon_all_office, for all + with check(true))이
--   이미 anon 역할에 전체 CRUD를 허용하므로 별도 정책 변경은 불필요.
--
-- Supabase Dashboard > SQL Editor 에 붙여넣어 실행.
-- ============================================================

alter table public.office
  add column if not exists dia_updated_at timestamptz;
