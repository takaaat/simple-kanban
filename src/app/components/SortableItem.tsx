import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Item } from './Item';
import { Task } from '@/types/types';

export function SortableItem(props: {
  task: Task;
  editing: number;
  onClick: () => void;
  unFocus: () => void;
  onTaskChange: (targetTask: Task, newName: string) => void;
  handleDelete: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: props.task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Item
        task={props.task}
        editing={props.editing}
        onClick={props.onClick}
        unFocus={props.unFocus}
        onTaskChange={props.onTaskChange}
        handleDelete={props.handleDelete}
        {...attributes}
        {...listeners}
      />
    </div>
  );
}
