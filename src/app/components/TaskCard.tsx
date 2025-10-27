import { Task } from '@/types/types';
import React, { forwardRef, useEffect, useRef } from 'react';

type ItemProps = {
  task: Task;
  editing: number;
  onClick: () => void;
  unFocus: () => void;
  onTaskChange: (targetTask: Task, newName: string) => void;
  handleDelete: () => void;
  children?: React.ReactNode;
};

export const TaskCard = forwardRef<HTMLDivElement, ItemProps>(
  (
    { task, editing, onClick, unFocus, onTaskChange, handleDelete, ...props },
    ref
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);

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
        {...props}
        ref={ref}
        className="bg-white w-full text-lg border-2 mb-2"
      >
        {task.id === editing ? (
          <input
            ref={inputRef}
            value={task.name}
            onChange={(e) => onTaskChange(task, e.target.value)}
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
              onClick={handleDelete}
            >
              D
            </button>
          </div>
        )}
      </div>
    );
  }
);
