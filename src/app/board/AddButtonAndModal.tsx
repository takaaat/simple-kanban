'use client';

import { useActionState, useState } from 'react';
import { createBoardAction } from './actions';

export default function AddButtonAndModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [idInput, setIdInput] = useState('');
  const [titleInput, setTitleInput] = useState('');

  const [message, formAction, isPending] = useActionState(
    async (_: string | null, formData: FormData) => {
      const m = await createBoardAction(formData);
      if (m === null) {
        setIsOpen(false);
      }
      return m;
    },
    ''
  );

  return (
    <div className="relative w-full">
      <button
        onClick={() => {
          setIsOpen(true);
          setIdInput('');
          setTitleInput('');
        }}
        className="h-40 w-full p-6 shadow-xs rounded-xl bg-white cursor-pointer hover:bg-gray-200 duration-200"
      >
        かんばんを作成
      </button>

      {isOpen && (
        <div className="absolute left-full top-0 z-50 ml-2 w-80 rounded-xl border bg-white p-4 shadow-lg">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">追加</h2>

            <button
              onClick={() => setIsOpen(false)}
              className="rounded px-2 py-1 text-gray-500 hover:bg-gray-100 cursor-pointer"
            >
              閉じる ✕
            </button>
          </div>

          <form action={formAction} className="space-y-3">
            <div>
              <label
                className="mb-1 block text-sm font-medium text-gray-700"
                htmlFor="slug"
              >
                リンク
              </label>
              <input
                type="text"
                name="slug"
                value={idInput}
                onChange={(e) => {
                  setIdInput(e.target.value);
                }}
                className="w-full rounded-lg border px-3 py-2 focus:border-blue-500 focus:outline-none"
                placeholder="/board/idのidの部分を入力"
              />
            </div>

            <div>
              <label
                className="mb-1 block text-sm font-medium text-gray-700"
                htmlFor="title"
              >
                タイトル
              </label>
              <input
                type="text"
                name="title"
                value={titleInput}
                onChange={(e) => {
                  setTitleInput(e.target.value);
                }}
                className="w-full rounded-lg border px-3 py-2 focus:border-blue-500 focus:outline-none"
                placeholder="タイトルを入力"
              />
            </div>

            <div className="text-red-500">{message}</div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg border px-3 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                キャンセル
              </button>

              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-3 py-2 text-white hover:bg-blue-700 cursor-pointer"
              >
                {isPending ? '処理中です...' : '作成'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
