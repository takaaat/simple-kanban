import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Draggable } from './Draggable';
import { CardArea, Task } from '@/types/types';

type Props = {
  area: CardArea;
  id: string;
  editingTaskId: number;
  startEditingTask: (taskId: number) => void;
  stopEditingTask: () => void;
  editTask: (targetTask: Task, newName: string) => void;
  deleteTask: (taskId: number) => void;
  addTask: (areaId: string) => void;
  editArea: (areaId: string, newName: string) => void;
  deleteArea: (areaId: string) => void;
};

const Column = ({
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
  const { isOver, setNodeRef } = useDroppable({ id: id });

  return (
    <SortableContext
      id={String(id)}
      items={area.tasks}
      strategy={verticalListSortingStrategy}
    >
      <div
        ref={setNodeRef}
        className={`w-100 h-200 flex-none border-2 p-2 ${isOver ? 'bg-blue-200' : 'bg-gray-100'}`}
      >
        <div className="flex justify-between">
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
                  window.confirm('Are you sure you want to delete this area?')
                ) {
                  deleteArea(area.id);
                }
              }}
            >
              Delete
            </button>
          </div>
        </div>
        {area.tasks.map((task) => (
          <Draggable
            key={task.id}
            task={task}
            editingTaskId={editingTaskId}
            onStartEditingTask={() => startEditingTask(task.id)}
            onStopEditingTask={stopEditingTask}
            editTask={editTask}
            deleteTask={() => deleteTask(task.id)}
          />
        ))}
        <button
          className="w-full rounded border border-neutral-300 text-neutral-600 hover:bg-neutral-100 transition   mb-2 text-center bg-white cursor-pointer"
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

export default Column;
