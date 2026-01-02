import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

export default async function Page() {
  const supabase = await createClient();
  const boards = await supabase.from('boards').select('*');

  if (!boards.data) {
    return <div>Error</div>;
  }

  return (
    <div>
      <h1 className="text-2xl">ボード一覧</h1>
      {boards.data.map((board) => (
        <Link
          href={'/board/' + board.slug}
          className="text-blue-500"
          key={board.slug}
        >
          {board.title} (/{board.slug})
        </Link>
      ))}
    </div>
  );
}
