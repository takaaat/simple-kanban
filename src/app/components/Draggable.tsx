import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TaskCard } from './TaskCard';
import { Task } from '@/types/types';

type Props = {
  task: Task;
  editing: number;
  onCardClick: () => void;
  unFocus: () => void;
  onTaskChange: (targetTask: Task, newName: string) => void;
  handleTaskDelete: () => void;
};

export function Draggable({
  task,
  editing,
  onCardClick,
  unFocus,
  onTaskChange,
  handleTaskDelete: handleTaskDelete,
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
        editing={editing}
        onCardClick={onCardClick}
        unFocus={unFocus}
        onTaskChange={onTaskChange}
        handleTaskDelete={handleTaskDelete}
        {...attributes}
        {...(task.id === editing ? {} : listeners)}
      />
    </div>
  );
}
