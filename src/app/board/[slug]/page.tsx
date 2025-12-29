'use server';

import { createClient } from '@/lib/supabase/server';
import { KanbanView } from './kanbanVIew';
import { CardArea } from '@/types/types';

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
    tasks:cards (
      id,
      name
    )
  `
    )
    .eq('board_id', boardId)
    .order('sort_order');
  if (error || !data) {
    return <div></div>;
  }
  const boardData: CardArea[] = data;
  return <KanbanView slug={slug} kanbanData={boardData} />;
}
