alter table profiles enable row level security;
alter table projects enable row level security;
alter table project_intents enable row level security;
alter table project_members enable row level security;
alter table project_updates enable row level security;
alter table project_comments enable row level security;
alter table notifications enable row level security;
alter table tags enable row level security;
alter table project_tags enable row level security;

-- profiles
create policy "profiles select all" on profiles
for select using (true);
create policy "profiles self update" on profiles
for update using (auth.uid() = id);

-- projects
create policy "projects public read" on projects
for select using (is_public = true);
create policy "projects insert owner" on projects
for insert with check (auth.uid() = owner_id);
create policy "projects update owner" on projects
for update using (auth.uid() = owner_id);

-- intents
create policy "intents read public" on project_intents
for select using (exists (select 1 from projects p where p.id = project_id and p.is_public));
create policy "intents upsert self" on project_intents
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- comments
create policy "comments read public" on project_comments
for select using (exists (select 1 from projects p where p.id = project_id and p.is_public));
create policy "comments write auth" on project_comments
for insert with check (auth.uid() = author_id);

-- updates
create policy "updates read public" on project_updates
for select using (exists (select 1 from projects p where p.id = project_id and p.is_public));
create policy "updates write member" on project_updates
for insert with check (
  auth.uid() = author_id and
  exists (select 1 from project_members m where m.project_id = project_id and m.user_id = auth.uid())
);
