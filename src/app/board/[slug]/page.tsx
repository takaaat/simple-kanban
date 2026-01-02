'use server';

import { createClient } from '@/lib/supabase/server';
import { KanbanView } from './kanbanVIew';

export default async function Home({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();
  // RLS前提
  const board = await supabase
    .from('boards')
    .select('id')
    .eq('slug', slug)
    .limit(1)
    .single();
  if (board.error || !board.data) {
    return <div>Board not found.</div>;
  }
  const boardId = board.data.id;

  const { data, error } = await supabase
    .from('columns')
    .select(
      `
    id,
    name,
    board_id,
    sort_rank,
    tasks (
      id,
      name,
      column_id,
      sort_rank
    )
  `
    )
    .eq('board_id', boardId);
  if (error || !data) {
    return <div></div>;
  }
  return <KanbanView slug={slug} boardId={boardId} kanbanData={data} />;
}
