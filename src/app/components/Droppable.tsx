import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableItem } from './SortableItem';
import { CardArea, Task } from '@/types/types';

type Props = {
  area: CardArea;
  id: string;
  editing: number;
  onClick: (id: number) => void;
  unFocus: () => void;
  onTaskChange: (targetTask: Task, newName: string) => void;
  handleDelete: (id: number) => void;
  addTask: (areaId: string) => void;
  editArea: (areaId: string, newName: string) => void;
  deleteArea: (areaId: string) => void;
};

const Droppable = ({
  editing,
  area,
  id,
  onClick,
  editArea,
  deleteArea,
  unFocus,
  onTaskChange,
  handleDelete,
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
          <SortableItem
            key={task.id}
            task={task}
            editing={editing}
            onClick={() => onClick(task.id)}
            unFocus={unFocus}
            onTaskChange={onTaskChange}
            handleDelete={() => handleDelete(task.id)}
          />
        ))}
        <button
          className="w-full text-lg border-2 mb-2 text-center bg-white cursor-pointer"
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

export default Droppable;
