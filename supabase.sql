create table boards (
    id uuid default gen_random_uuid() primary key,
    slug text not null,
    user_id uuid references auth.users not null,
    title text not null,
    unique (user_id, slug)
);

create table columns (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    board_id uuid references boards(id) on delete cascade,
    sort_rank text not null
);

create table tasks (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    column_id uuid references columns(id) on delete cascade,
    sort_rank text not null
);


alter table boards enable row level security;
alter table columns enable row level security;
alter table tasks enable row level security;

create policy "Users can view their own boards"
on boards for select
using ( auth.uid() = user_id );

create policy "Users can insert their own boards"
on boards for insert
with check ( auth.uid() = user_id );

create policy "Users can update their own boards"
on boards for update
using ( auth.uid() = user_id );

create policy "Users can delete their own boards"
on boards for delete
using ( auth.uid() = user_id );

create policy "Users can view columns of their boards"
on columns for select
using (
  exists (
    select 1 from boards
    where boards.id = columns.board_id
    and boards.user_id = auth.uid()
  )
);

create policy "Users can insert columns into their boards"
on columns for insert
with check (
  exists (
    select 1 from boards
    where boards.id = columns.board_id
    and boards.user_id = auth.uid()
  )
);

create policy "Users can update/delete columns of their boards"
on columns for all
using (
  exists (
    select 1 from boards
    where boards.id = columns.board_id
    and boards.user_id = auth.uid()
  )
);

create policy "Users can manage tasks of their boards"
on tasks for all
using (
  exists (
    select 1 from columns
    join boards on columns.board_id = boards.id
    where columns.id = tasks.column_id
    and boards.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from columns
    join boards on columns.board_id = boards.id
    where columns.id = tasks.column_id
    and boards.user_id = auth.uid()
  )
);