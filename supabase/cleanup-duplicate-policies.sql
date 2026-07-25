-- ============================================================
-- 중복 RLS 정책 정리
-- ------------------------------------------------------------
-- anon_all_* (anon, ALL) 정책으로 통일하고, 이전에 만들어 둔
-- public 역할의 작업별 정책(*_read/_insert/_update/_delete,
-- "Enable read access for all users" 등)을 제거한다.
--
-- 기능 변화 없음: 모든 테이블이 anon_all_* 로 이미 전체 CRUD 허용 중.
-- 단지 중복된 옛 정책을 걷어내 한 세트로 정리하는 작업.
--
-- maintenance 는 의도적으로 제외 (anon 쓰기 정책이 없는 읽기 전용 테이블로 보임).
-- 이 앱은 anon key 만 사용하므로 public→anon 통일로 인한 접근 손실 없음.
--
-- Supabase Dashboard > SQL Editor 에서 실행. 재실행 안전(if exists).
-- ============================================================

-- announcements ----------------------------------------------
drop policy if exists announcements_read   on public.announcements;
drop policy if exists announcements_insert on public.announcements;
drop policy if exists announcements_update on public.announcements;
drop policy if exists announcements_delete on public.announcements;

-- app_settings -----------------------------------------------
drop policy if exists app_settings_read   on public.app_settings;
drop policy if exists app_settings_update on public.app_settings;

-- document_options -------------------------------------------
drop policy if exists document_options_read   on public.document_options;
drop policy if exists document_options_insert on public.document_options;
drop policy if exists document_options_update on public.document_options;
drop policy if exists document_options_delete on public.document_options;

-- document_reads ---------------------------------------------
drop policy if exists document_reads_read   on public.document_reads;
drop policy if exists document_reads_insert on public.document_reads;
drop policy if exists document_reads_delete on public.document_reads;

-- document_votes ---------------------------------------------
drop policy if exists document_votes_read   on public.document_votes;
drop policy if exists document_votes_insert on public.document_votes;
drop policy if exists document_votes_update on public.document_votes;
drop policy if exists document_votes_delete on public.document_votes;

-- documents --------------------------------------------------
drop policy if exists documents_read   on public.documents;
drop policy if exists documents_insert on public.documents;
drop policy if exists documents_update on public.documents;
drop policy if exists documents_delete on public.documents;

-- special_schedules ------------------------------------------
drop policy if exists special_schedules_read   on public.special_schedules;
drop policy if exists special_schedules_insert on public.special_schedules;
drop policy if exists special_schedules_update on public.special_schedules;
drop policy if exists special_schedules_delete on public.special_schedules;

-- office / work_patterns (옛 읽기 전용 정책 제거) -------------
drop policy if exists "Enable read access for all users" on public.office;
drop policy if exists "Enable read access for all users" on public.work_patterns;
