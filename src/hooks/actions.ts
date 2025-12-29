'use server';

import { createClient } from '@/lib/supabase/server';
import { Column } from '@/types/types';

export async function addAreaAction(
  boardId: string,
  newArea: Column
): Promise<boolean> {
  const supabase = await createClient();

  const { tasks: _, ...newAreaWithoutChildren } = newArea;
  const { data, error } = await supabase
    .from('columns')
    .insert(newAreaWithoutChildren);
  if (error) {
    console.log(error);
    return false;
  }
  console.log(data);
  return true;
}
