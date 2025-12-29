create table boards (
    id uuid default gen_random_uuid() primary key,
    slug text,
    user_id uuid references auth.users not null,
    title text
);

create table columns (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    board_id uuid references boards(id) on delete cascade,
    sort_order integer default 0
);

create table tasks (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    column_id uuid references columns(id) on delete cascade,
    sort_order integer default 0
);