import { useDroppable } from '@dnd-kit/core';
import type { ReactNode } from 'react';

type Props = {
  name: string;
  id: string;
  onAdd: () => void;
  children?: ReactNode;
};

export function CardBox({ name, id, onAdd, children }: Props) {
  const { isOver, setNodeRef } = useDroppable({
    id: id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`w-100 h-200 flex-none border-2 p-2 ${isOver ? 'bg-blue-200' : 'bg-gray-100'}`}
    >
      <div className="pb-2">{name}</div>
      {children}
      <button
        className="cursor-pointer text-center w-full bg-gray-300 mt-3"
        type="button"
        onClick={onAdd}
      >
        + add
      </button>
    </div>
  );
}
