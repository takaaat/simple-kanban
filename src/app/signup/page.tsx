'use client';

import { useActionState } from 'react';
import { signupAction } from './actions';
import Link from 'next/link';

export default function LoginPage() {
  const [message, formAction, isPending] = useActionState(signupAction, null);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm">
        <div className="bg-white shadow p-8">
          <h1 className="text-2xl font-semibold text-center mb-6">
            アカウント登録
          </h1>

          <form className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                メールアドレス
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                パスワード
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                formAction={formAction}
                disabled={isPending}
                data-pending={isPending ? '' : undefined}
                className="flex-1 rounded bg-blue-600 py-2 text-white hover:bg-blue-700 data-pending:bg-gray-500 data-pending:hover:bg-gray-500 cursor-pointer"
              >
                {isPending ? '処理中です...' : '新規登録'}
              </button>
            </div>

            <Link href="/login" className="text-blue-600">
              登録済みの方はこちらからログイン
            </Link>

            <div className="text-red-500">{message}</div>
          </form>
        </div>
      </div>
    </div>
  );
}
