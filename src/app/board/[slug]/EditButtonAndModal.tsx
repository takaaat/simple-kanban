'use client';

import { useState, useActionState } from 'react';
import { deleteBoardAction, editBoardAction } from '../actions';

type Props = {
  currentSlug: string;
  currentTitle: string;
  boardId: string;
};

export default function EditButtonAndModal({
  currentSlug,
  currentTitle,
  boardId,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [slugInput, setSlugInput] = useState(currentSlug);
  const [titleInput, setTitleInput] = useState(currentTitle);

  const [deleteMessage, deleteFormAction, isDeletePending] = useActionState(
    async (_: string | null, formData: FormData) => {
      const m = await deleteBoardAction(boardId);
      if (m === null) {
        setIsOpen(false);
      }
      return m;
    },
    ''
  );

  const [editMessage, editFormAction, isEditPending] = useActionState(
    async (_: string | null, formData: FormData) => {
      const m = await editBoardAction(boardId, formData);
      if (m === null) {
        setIsOpen(false);
      }
      return m;
    },
    ''
  );

  return (
    <div className="relative">
      <div
        className="hover:bg-blue-900 text-blue-100 duration-200 rounded-sm cursor-pointer"
        onClick={() => {
          setIsOpen(true);
          setSlugInput(currentSlug);
          setTitleInput(currentTitle);
        }}
      >
        かんばんの設定
      </div>

      {isOpen && (
        <div className="absolute right-full top-0 z-50 mr-4 w-80 rounded-xl border bg-white p-4 shadow-lg">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">かんばん情報の編集</h2>

            <button
              onClick={() => setIsOpen(false)}
              className="rounded px-2 py-1 text-gray-500 hover:bg-gray-100 cursor-pointer"
            >
              閉じる ✕
            </button>
          </div>

          <form className="space-y-3">
            <div>
              <label
                className="mb-1 block text-sm font-medium text-gray-700"
                htmlFor="slug"
              >
                かんばんID
              </label>
              <input
                type="text"
                name="slug"
                value={slugInput}
                onChange={(e) => {
                  setSlugInput(e.target.value);
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

            <div className="text-red-500">{editMessage}</div>
            <div className="text-red-500">{deleteMessage}</div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                disabled={isEditPending || isDeletePending}
                className="rounded-lg border px-3 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                キャンセル
              </button>

              <button
                type="submit"
                formAction={deleteFormAction}
                disabled={isEditPending || isDeletePending}
                className="rounded-lg bg-red-600 px-3 py-2 text-white hover:bg-red-700 cursor-pointer"
              >
                削除
              </button>

              <button
                type="submit"
                formAction={editFormAction}
                disabled={isEditPending || isDeletePending}
                className="rounded-lg bg-blue-600 px-3 py-2 text-white hover:bg-blue-700 cursor-pointer"
              >
                変更
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
