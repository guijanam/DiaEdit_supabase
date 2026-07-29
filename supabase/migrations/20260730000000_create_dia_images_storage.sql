-- ============================================================
-- Storage 정책: dia-images 버킷
-- ------------------------------------------------------------
-- dia 테이블의 total_time/third_time에 들어가는 행로표 이미지를
-- 저장하는 public 버킷. rls-policies.sql과 동일하게 이 앱은
-- Supabase Auth를 쓰지 않고 anon key로만 접근하므로, storage.objects
-- 에도 anon 역할에 이 버킷 한정 전체 권한을 허용한다.
--
-- 보안 민감도가 낮은 폐쇄적 서비스 전제. 더 강한 보안이 필요하면
-- 쓰기 작업을 Edge Function(service_role)으로 이전할 것.
--
-- Supabase Dashboard > SQL Editor 에 붙여넣어 실행.
-- ============================================================

-- 1) 버킷 생성 (public이라 누구나 읽기 가능, 업로드는 아래 정책으로 anon에 허용)
insert into storage.buckets (id, name, public)
values ('dia-images', 'dia-images', true)
on conflict (id) do update set public = true;

-- 2) 기존 동일 정책이 있으면 제거 (재실행 안전)
drop policy if exists "anon_all_dia_images" on storage.objects;

-- 3) anon 역할에 dia-images 버킷 한정 전체 권한 허용 (select/insert/update/delete)
create policy "anon_all_dia_images"
  on storage.objects
  for all
  to anon
  using (bucket_id = 'dia-images')
  with check (bucket_id = 'dia-images');
