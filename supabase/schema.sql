create extension if not exists pgcrypto;

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null,
  content text not null,
  cover_image text,
  author_name text not null,
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  author_id uuid not null default auth.uid()
);

create index if not exists idx_blog_posts_status_published_at
  on public.blog_posts (status, published_at desc);

create index if not exists idx_blog_posts_slug on public.blog_posts (slug);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_blog_posts_updated_at on public.blog_posts;

create trigger trg_blog_posts_updated_at
before update on public.blog_posts
for each row
execute function public.set_updated_at();

alter table public.blog_posts enable row level security;

drop policy if exists "Public can read published posts" on public.blog_posts;
create policy "Public can read published posts"
on public.blog_posts
for select
to anon, authenticated
using (status = 'published');

drop policy if exists "Authenticated can read own drafts" on public.blog_posts;
create policy "Authenticated can read own drafts"
on public.blog_posts
for select
to authenticated
using (author_id = auth.uid());

drop policy if exists "Authenticated can insert own posts" on public.blog_posts;
create policy "Authenticated can insert own posts"
on public.blog_posts
for insert
to authenticated
with check (author_id = auth.uid());

drop policy if exists "Authenticated can update own posts" on public.blog_posts;
create policy "Authenticated can update own posts"
on public.blog_posts
for update
to authenticated
using (author_id = auth.uid())
with check (author_id = auth.uid());

drop policy if exists "Authenticated can delete own posts" on public.blog_posts;
create policy "Authenticated can delete own posts"
on public.blog_posts
for delete
to authenticated
using (author_id = auth.uid());
