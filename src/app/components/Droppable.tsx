import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableItem } from './SortableItem';
import { Task } from '@/types/types';

type Props = {
  id: string;
  items: Task[];
  editing: number;
  onClick: (id: number) => void;
  unFocus: () => void;
  onTaskChange: (targetTask: Task, newName: string) => void;
  handleDelete: (id: number) => void;
  addTask: (areaId: string) => void;
};

const Droppable = ({
  id,
  items,
  editing,
  onClick,
  unFocus,
  onTaskChange,
  handleDelete,
  addTask,
}: Props) => {
  const { isOver, setNodeRef } = useDroppable({ id: id });

  return (
    <SortableContext
      id={String(id)}
      items={items}
      strategy={verticalListSortingStrategy}
    >
      <div
        ref={setNodeRef}
        className={`w-100 h-200 flex-none border-2 p-2 ${isOver ? 'bg-blue-200' : 'bg-gray-100'}`}
      >
        {items.map((item) => (
          <SortableItem
            key={item.id}
            task={item}
            editing={editing}
            onClick={() => onClick(item.id)}
            unFocus={unFocus}
            onTaskChange={onTaskChange}
            handleDelete={() => handleDelete(item.id)}
          />
        ))}
        <button
          className="w-full text-lg border-2 mb-2 text-center bg-white cursor-pointer"
          onClick={() => {
            addTask(id);
          }}
        >
          + Add
        </button>
      </div>
    </SortableContext>
  );
};

export default Droppable;
