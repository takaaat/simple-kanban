import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableItem } from './SortableItem';

const Droppable = ({ id, items }) => {
  const { setNodeRef } = useDroppable({ id: id });

  return (
    <SortableContext
      id={String(id)}
      items={items}
      strategy={verticalListSortingStrategy}
    >
      <div ref={setNodeRef} className="bg-red-500 p-3 m-2">
        {items.map((item) => (
          <SortableItem key={item.id} task={item} />
        ))}
      </div>
    </SortableContext>
  );
};

export default Droppable;
