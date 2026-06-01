import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Draggable } from './Draggable';
import { Column, Task } from '@/types/types';
import { TaskCard } from './TaskCard';

type Props = {
  area: Column;
  id: string;
  editingTaskId: string;
  startEditingTask: (taskId: string) => void;
  stopEditingTask: () => void;
  editTask: (targetTask: Task, newName: string) => void;
  deleteTask: (taskId: string) => void;
  addTask: (areaId: string) => void;
  editArea: (areaId: string, newName: string) => void;
  moveColumn: (columnId: string, newPosition: number) => void;
  deleteArea: (areaId: string) => void;
};

const ColumnComponent = ({
  editingTaskId,
  area,
  id,
  startEditingTask,
  moveColumn,
  editArea,
  deleteArea,
  stopEditingTask,
  editTask,
  deleteTask,
  addTask,
}: Props) => {
  const { setNodeRef } = useDroppable({ id: id });

  return (
    <SortableContext
      id={String(id)}
      items={area.tasks}
      strategy={verticalListSortingStrategy}
    >
      <div
        ref={setNodeRef}
        className="w-100 h-full min-h-0 flex flex-col p-3 overflow-hidden bg-gray-50 border border-gray-200 rounded-lg shadow-2xs"
      >
        <div className="flex justify-between flex-none">
          <div className="pb-1 font-semibold">{area.name}</div>
          <div className="flex gap-1">
            <button
              type="button"
              className="cursor-pointer p-1 hover:bg-gray-200 rounded transition text-gray-400 hover:text-gray-600"
              onClick={() => {
                const newName = window.prompt(
                  'Column名を入力してください。「#0」や「.1」のようにはじめに#または.を入力したのち番号を指定するとその位置にColumnを移動します。',
                  area.name
                );
                if (newName === null) {
                  return;
                }
                if (newName.startsWith('.') || newName.startsWith('#')) {
                  const newPosition = parseInt(newName.slice(1));
                  if (!Number.isNaN(newPosition)) {
                    moveColumn(area.id, newPosition);
                    return;
                  }
                }
                editArea(area.id, newName);
              }}
              aria-label="Edit column"
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
                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                <path d="m15 5 4 4" />
              </svg>
            </button>

            <button
              type="button"
              className="cursor-pointer p-1 hover:bg-gray-200 rounded transition text-gray-400 hover:text-gray-600"
              onClick={() => {
                if (
                  window.confirm('Are you sure you want to delete this column?')
                ) {
                  deleteArea(area.id);
                }
              }}
              aria-label="Delete column"
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
        </div>
        <div className="mt-2 flex-1 min-h-0 overflow-y-auto pr-1">
          {area.tasks.map((task) => (
            <Draggable
              key={task.id}
              taskId={task.id}
              editingTaskId={editingTaskId}
            >
              <TaskCard
                task={task}
                editingTaskId={editingTaskId}
                startEditingTask={() => startEditingTask(task.id)}
                stopEditingTask={stopEditingTask}
                editTask={editTask}
                deleteTask={() => deleteTask(task.id)}
              />
            </Draggable>
          ))}
        </div>
        <button
          className="w-full rounded-lg text-neutral-600 hover:bg-neutral-100 transition mt-2 cursor-pointer flex-none"
          onClick={() => {
            addTask(area.id);
          }}
        >
          + card
        </button>
      </div>
    </SortableContext>
  );
};

export default ColumnComponent;
