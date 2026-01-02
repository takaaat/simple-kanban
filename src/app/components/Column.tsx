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
  deleteArea: (areaId: string) => void;
};

const ColumnComponent = ({
  editingTaskId,
  area,
  id,
  startEditingTask,
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
        className="w-100 h-full min-h-0 flex flex-col border-2 p-2 overflow-hidden"
      >
        <div className="flex justify-between flex-none">
          <div className="pb-1">{area.name}</div>
          <div className="flex gap-2">
            <button
              type="button"
              className="cursor-pointer underline"
              onClick={() => {
                const newName = window.prompt('Type new area name:', area.name);
                if (newName === null) {
                  return;
                }

                editArea(area.id, newName);
              }}
            >
              Edit
            </button>

            <button
              type="button"
              className="cursor-pointer underline"
              onClick={() => {
                if (
                  window.confirm('Are you sure you want to delete this column?')
                ) {
                  deleteArea(area.id);
                }
              }}
            >
              Delete
            </button>
          </div>
        </div>
        <div className="mt-2 flex-1 min-h-0 overflow-y-auto space-y-2 pr-1">
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
          className="w-full rounded border border-neutral-300 text-neutral-600 hover:bg-neutral-100 transition mt-2 text-center bg-white cursor-pointer flex-none"
          onClick={() => {
            addTask(area.id);
          }}
        >
          + Add
        </button>
      </div>
    </SortableContext>
  );
};

export default ColumnComponent;
