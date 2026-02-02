import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { logout } from './login/actions';

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

      <div className="pt-5">
        <form action={logout}>
          <button className="p-2 border-1 cursor-pointer">ログアウト</button>
        </form>
      </div>
    </div>
  );
}
