import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableItem } from './SortableItem';

const Droppable = ({ id, items }) => {
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
          <SortableItem key={item.id} task={item} />
        ))}
      </div>
    </SortableContext>
  );
};

export default Droppable;
