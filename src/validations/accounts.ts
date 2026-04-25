import z from 'zod';

export const accountSchema = z.object({
  email: z
    .email('有効なメールアドレスを使用してください。')
    .nonempty('メールアドレスは必須です。'),
  password: z
    .string()
    .nonempty('パスワードは必須です。')
    .min(8, 'パスワードは8文字以上で入力してください。'),
});
