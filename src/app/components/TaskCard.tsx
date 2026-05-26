import { Task } from '@/types/types';
import Link from 'next/link';
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
        className="bg-white w-full text-lg border border-gray-300 rounded-lg shadow-sm"
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
          <div className="flex justify-between group">
            <button
              onClick={startEditingTask}
              className="text-left w-full cursor-pointer p-2"
            >
              {task.name.startsWith('/') ? (
                <div>
                  <Link
                    href={`/board/${task.name.slice(1)}`}
                    className="cursor-pointer text-blue-500 hover:bg-blue-300"
                  >
                    {task.name}
                  </Link>
                </div>
              ) : (
                <div>{task.name}</div>
              )}
            </button>
            <button
              type="button"
              className="w-8 cursor-pointer hidden group-hover:block text-gray-300 hover:text-gray-800 "
              onClick={handleDelete}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 6h18" />
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                <line x1="10" x2="10" y1="11" y2="17" />
                <line x1="14" x2="14" y1="11" y2="17" />
              </svg>
            </button>
          </div>
        )}
      </div>
    );
  }
);
