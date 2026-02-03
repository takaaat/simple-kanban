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
    <div className="min-h-screen bg-gray-50 ">
      <div className="container mx-auto pt-5">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl py-3">かんばんリスト</h1>
          <div className="">
            <form action={logout}>
              <button className="p-2 border-1 cursor-pointer hover:bg-gray-600 hover:text-white transition-colors">
                ログアウト
              </button>
            </form>
          </div>
        </div>
        {boards.data.map((board) => (
          <Link
            href={'/board/' + board.slug}
            className="text-blue-500 text-xl hover:text-blue-700"
            key={board.slug}
          >
            {board.title} (/{board.slug})
          </Link>
        ))}
      </div>
    </div>
  );
}
