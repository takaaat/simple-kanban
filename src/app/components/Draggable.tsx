import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

type Props = {
  taskId: string;
  editingTaskId: string;
  children: React.ReactNode;
};

export function Draggable({ taskId, editingTaskId, children }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: taskId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  // 編集中にinput内部で入力テキストをカーソルで選択する際にtaskcardごと移動するのを防ぐために条件設定
  const dragListeners = taskId === editingTaskId ? {} : listeners;

  return (
    <div ref={setNodeRef} style={style} className="mb-2">
      <div {...attributes} {...dragListeners}>
        {children}
      </div>
    </div>
  );
}
