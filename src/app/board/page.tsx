import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { logout } from '../login/actions';
import AddButtonAndModal from './AddButtonAndModal';

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
              <button className="p-2 border cursor-pointer hover:bg-gray-600 hover:text-white transition-colors">
                ログアウト
              </button>
            </form>
          </div>
        </div>
        <div className="grid grid-cols-5 gap-3 mt-5">
          {boards.data.map((board) => (
            <Link href={'/board/' + board.slug} key={board.slug}>
              <div className="h-40 p-6 shadow-xs rounded-xl bg-white cursor-pointer hover:bg-gray-200 duration-200">
                <div className="text-xl">{board.title}</div>
                <div className="text-gray-600">/{board.slug}</div>
              </div>
            </Link>
          ))}

          <AddButtonAndModal />
        </div>
      </div>
    </div>
  );
}
