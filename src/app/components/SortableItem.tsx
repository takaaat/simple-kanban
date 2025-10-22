import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Item } from './Item';
import { Task } from '@/types/types';

type Props = {
  task: Task;
  editing: number;
  onClick: () => void;
  unFocus: () => void;
  onTaskChange: (targetTask: Task, newName: string) => void;
  handleDelete: () => void;
};

export function SortableItem({
  task,
  editing,
  onClick,
  unFocus,
  onTaskChange,
  handleDelete,
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
      <Item
        task={task}
        editing={editing}
        onClick={onClick}
        unFocus={unFocus}
        onTaskChange={onTaskChange}
        handleDelete={handleDelete}
        {...attributes}
        {...(task.id === editing ? {} : listeners)}
      />
    </div>
  );
}
