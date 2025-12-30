'use server';

import { createClient } from '@/lib/supabase/server';
import { Column, Task } from '@/types/types';

export async function addColumnAction(
  boardId: string,
  newArea: Column
): Promise<boolean> {
  const supabase = await createClient();

  const { tasks: _, ...newAreaWithoutChildren } = newArea;
  const { error } = await supabase
    .from('columns')
    .insert(newAreaWithoutChildren);
  if (error) {
    console.log(error);
    return false;
  }
  return true;
}

export async function addTaskAction(newTask: Task): Promise<boolean> {
  const supabase = await createClient();
  const { error } = await supabase.from('tasks').insert(newTask);
  if (error) {
    return false;
  }
  if (error) {
    console.log(error);
  }
  return true;
}
