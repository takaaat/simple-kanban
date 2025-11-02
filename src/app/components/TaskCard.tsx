import { Task } from '@/types/types';
import React, { forwardRef, useEffect, useRef } from 'react';

type ItemProps = {
  task: Task;
  editingTaskId: number;
  startEditingTask: () => void;
  stopEditingTask: () => void;
  editTask: (targetTask: Task, newName: string) => void;
  deleteTask: () => void;
  children?: React.ReactNode;
};

export const TaskCard = forwardRef<HTMLDivElement, ItemProps>(
  (
    {
      task,
      editingTaskId,
      startEditingTask,
      stopEditingTask,
      editTask,
      deleteTask: handleDelete,
      ...props
    },
    ref
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleBlur = () => {
      stopEditingTask();
    };

    useEffect(() => {
      if (task.id === editingTaskId && inputRef.current) {
        inputRef.current.focus();
      }
    }, [editingTaskId, task.id]);

    return (
      <div
        {...props}
        ref={ref}
        className="bg-white w-full text-lg border-2 mb-2"
      >
        {task.id === editingTaskId ? (
          <input
            ref={inputRef}
            value={task.name}
            onChange={(e) => editTask(task, e.target.value)}
            className="w-full p-2"
            onBlur={handleBlur}
          />
        ) : (
          <div className="flex justify-between">
            <button
              onClick={startEditingTask}
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
