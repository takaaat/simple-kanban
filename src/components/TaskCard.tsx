import { useEffect, useRef } from 'react';
import type { Task } from '@/types/types';
import { useDraggable } from '@dnd-kit/core';

type Props = {
  task: Task;
  editing: number;
  id: number;
  onClick: () => void;
  onChange: (targetTask: Task, newName: string) => void;
  unFocus: () => void;
  handleDelete: (taskId: number) => void;
};

export function TaskCard({
  unFocus,
  id,
  task,
  editing,
  onClick,
  onChange,
  handleDelete,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id,
  });
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  const handleBlur = () => {
    unFocus();
  };

  useEffect(() => {
    if (task.id === editing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editing, task.id]);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="bg-white w-full text-lg border-2 mb-2"
    >
      {task.id === editing ? (
        <input
          ref={inputRef}
          value={task.name}
          onChange={(e) => onChange(task, e.target.value)}
          className="w-full p-2"
          onBlur={handleBlur}
        />
      ) : (
        <div className="flex justify-between">
          <button
            onClick={onClick}
            className="text-left w-full cursor-pointer p-2"
          >
            {task.name}
          </button>
          <button
            type="button"
            className="bg-amber-200 w-10 cursor-pointer"
            onClick={() => handleDelete(task.id)}
          >
            D
          </button>
        </div>
      )}
    </div>
  );
}
