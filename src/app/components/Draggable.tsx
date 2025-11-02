import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TaskCard } from './TaskCard';
import { Task } from '@/types/types';

type Props = {
  task: Task;
  editingTaskId: number;
  onStartEditingTask: () => void;
  onStopEditingTask: () => void;
  editTask: (targetTask: Task, newName: string) => void;
  deleteTask: () => void;
};

export function Draggable({
  task,
  editingTaskId,
  onStartEditingTask,
  onStopEditingTask,
  editTask,
  deleteTask,
}: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <TaskCard
        task={task}
        editingTaskId={editingTaskId}
        startEditingTask={onStartEditingTask}
        stopEditingTask={onStopEditingTask}
        editTask={editTask}
        deleteTask={deleteTask}
        {...attributes}
        {...(task.id === editingTaskId ? {} : listeners)}
      />
    </div>
  );
}
