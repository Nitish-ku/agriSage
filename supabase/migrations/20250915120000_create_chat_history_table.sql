create table chat_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) not null,
  topic text,
  messages jsonb not null,
  created_at timestamptz default now()
);
