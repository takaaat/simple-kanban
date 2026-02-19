'use server';

import { createClient } from '@/lib/supabase/server';
import { Column, Task } from '@/types/types';

export async function addColumnAction(
  boardId: string,
  newColumn: Column
): Promise<boolean> {
  const supabase = await createClient();

  const { tasks: _, ...newColumnWithoutChildren } = newColumn;
  const { error } = await supabase
    .from('columns')
    .insert(newColumnWithoutChildren);
  if (error) {
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
  return true;
}

export async function deleteTaskAction(taskId: string): Promise<boolean> {
  const supabase = await createClient();
  const { error } = await supabase.from('tasks').delete().eq('id', taskId);
  if (error) {
    return false;
  }
  return true;
}

export async function deleteColumnAction(columnId: string): Promise<boolean> {
  const supabase = await createClient();
  const { error } = await supabase.from('columns').delete().eq('id', columnId);
  if (error) {
    return false;
  }
  return true;
}

export async function moveColumnAction(
  columnId: string,
  newRank: string
): Promise<boolean> {
  const supabase = await createClient();
  const { error } = await supabase
    .from('columns')
    .update({ sort_rank: newRank })
    .eq('id', columnId);
  if (error) {
    return false;
  }
  return true;
}

export async function renameColumnAction(
  columnId: string,
  newName: string
): Promise<boolean> {
  const supabase = await createClient();
  const { error } = await supabase
    .from('columns')
    .update({ name: newName })
    .eq('id', columnId);
  if (error) {
    return false;
  }
  return true;
}

export async function renameTaskAction(
  taskId: string,
  newName: string
): Promise<boolean> {
  const supabase = await createClient();
  const { error } = await supabase
    .from('tasks')
    .update({ name: newName })
    .eq('id', taskId);
  if (error) {
    return false;
  }
  return true;
}

export async function moveTaskAction(
  taskId: string,
  newSortRank: string,
  newColumnId: string
): Promise<boolean> {
  const supabase = await createClient();
  const { error } = await supabase
    .from('tasks')
    .update({ sort_rank: newSortRank, column_id: newColumnId })
    .eq('id', taskId);
  if (error) {
    return false;
  }
  return true;
}
