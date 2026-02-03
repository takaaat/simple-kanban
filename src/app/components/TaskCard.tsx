import { Task } from '@/types/types';
import React, { forwardRef, useEffect, useRef } from 'react';

type Props = {
  task: Task;
  editingTaskId: string;
  startEditingTask: () => void;
  stopEditingTask: () => void;
  editTask: (targetTask: Task, newName: string) => void;
  deleteTask: () => void;
  children?: React.ReactNode;
};

export const TaskCard = forwardRef<HTMLDivElement, Props>(
  (
    {
      task,
      editingTaskId,
      startEditingTask,
      stopEditingTask,
      editTask,
      deleteTask: handleDelete,
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
        ref={ref}
        className="bg-white w-full text-lg border border-gray-300 mb-2 rounded-lg shadow-sm"
      >
        {task.id === editingTaskId ? (
          <input
            ref={inputRef}
            value={task.name}
            onChange={(e) => editTask(task, e.target.value)}
            className="w-full p-2"
            onBlur={handleBlur}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleBlur();
              }
            }}
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
              className="w-10 cursor-pointer"
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
