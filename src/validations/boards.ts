import z from 'zod';

export const boardsSchema = z.object({
  slug: z.string('idを入力してください。').nonempty('idは必須です。'),
  title: z
    .string('タイトルを入力してください。')
    .nonempty('タイトルは必須です。'),
});
