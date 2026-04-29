'use server';

import { createClient } from '@/lib/supabase/server';
import { KanbanView } from './kanbanVIew';
import { Column } from '@/types/types';

export default async function Home({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  console.log('start loading');
  const { slug } = await params;
  const supabase = await createClient();

  const { data: board, error } = await supabase
    .from('boards')
    .select(
      `
      id,
      slug,
      title,
      columns (
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
      )
    `
    )
    .eq('slug', slug)
    .single();

  if (error || !board) {
    return <div></div>;
  }

  const kanbanData = board.columns as unknown as Column[];

  console.log('got columns');
  return (
    <KanbanView
      slug={slug}
      boardId={board.id}
      title={board.title}
      kanbanData={kanbanData}
    />
  );
}
