'use server';

import { createClient } from '@/lib/supabase/server';
import { boardsSchema } from '@/validations/boards';
import { revalidatePath } from 'next/cache';
import z from 'zod';

export async function createBoardAction(formData: FormData) {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();
  if (user.error) {
    return '認証に失敗しました。';
  }

  const data = {
    slug: formData.get('slug'),
    title: formData.get('title'),
  };

  const parsed = boardsSchema.safeParse(data);

  if (!parsed.success) {
    const errors = z.flattenError(parsed.error);
    return (
      errors.fieldErrors.slug?.[0] ??
      errors.fieldErrors.title?.[0] ??
      '入力内容を確認してください'
    );
  }

  const { error } = await supabase.from('boards').insert({
    ...parsed.data,
    user_id: user.data.user.id,
  });
  if (error) {
    return '新規作成に失敗しました。';
  }
  revalidatePath('/board');
  return null;
}
