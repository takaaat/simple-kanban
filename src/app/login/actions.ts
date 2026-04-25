'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { createClient } from '@/lib/supabase/server';
import { accountSchema } from '@/validations/accounts';
import z from 'zod';

export async function logout() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    redirect('/error');
  }
  revalidatePath('/', 'layout');
  redirect('/');
}

export async function loginAction(_: string | null, formData: FormData) {
  const supabase = await createClient();

  const data = {
    email: formData.get('email'),
    password: formData.get('password'),
  };

  const parsed = accountSchema.safeParse(data);

  if (!parsed.success) {
    const errors = z.flattenError(parsed.error);
    return (
      errors.fieldErrors.email?.[0] ??
      errors.fieldErrors.password?.[0] ??
      '入力内容を確認してください'
    );
  }

  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return 'ログインに失敗しました。';
  }

  revalidatePath('/', 'layout');
  redirect('/');
}
