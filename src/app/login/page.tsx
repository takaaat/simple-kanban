import { login, signup } from './actions';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm">
        <div className="bg-white shadow p-8">
          <h1 className="text-2xl font-semibold text-center mb-6">ログイン</h1>

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
                formAction={login}
                className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 cursor-pointer"
              >
                ログイン
              </button>
              <button
                formAction={signup}
                className="flex-1 bg-gray-100 text-gray-700 py-2 rounded hover:bg-gray-200 cursor-pointer"
              >
                新規登録
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
