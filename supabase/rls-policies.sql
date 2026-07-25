-- ============================================================
-- RLS 정책: dia / office 테이블
-- ------------------------------------------------------------
-- 이 앱은 Supabase Auth를 사용하지 않고, 모든 DB 접근이 anon key로
-- 이루어진다 (auth.uid() = null). 따라서 RLS를 켜되 anon 역할에
-- 전체 CRUD를 허용해야 기존 동작이 유지된다.
--
-- 보안 민감도가 낮은 폐쇄적 서비스 전제. 더 강한 보안이 필요하면
-- 쓰기 작업을 Edge Function(service_role)으로 이전할 것.
--
-- Supabase Dashboard > SQL Editor 에 붙여넣어 실행.
-- ============================================================

-- 1) RLS 활성화
alter table public.office enable row level security;
alter table public.dia    enable row level security;

-- 2) 기존 동일 정책이 있으면 제거 (재실행 안전)
drop policy if exists "anon_all_office" on public.office;
drop policy if exists "anon_all_dia"    on public.dia;

-- 3) anon 역할에 전체 CRUD 허용
create policy "anon_all_office"
  on public.office
  for all
  to anon
  using (true)
  with check (true);

create policy "anon_all_dia"
  on public.dia
  for all
  to anon
  using (true)
  with check (true);
