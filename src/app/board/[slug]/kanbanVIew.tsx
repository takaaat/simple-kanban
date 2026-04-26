'use client';

import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  closestCorners,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { TaskCard } from '../../components/TaskCard';
import ColumnComponent from '../../components/Column';
import { useKanban } from '../../../hooks/useKanban';
import { Column } from '@/types/types';
import Link from 'next/link';

interface KanbanViewProps {
  slug: string;
  boardId: string;
  kanbanData: Column[];
}

export function KanbanView({ slug, boardId, kanbanData }: KanbanViewProps) {
  const {
    sortedColumns,
    editingTaskId,
    draggingTaskId,
    activeTask,
    addTask,
    addColumn,
    editColumn,
    moveColumn,
    deleteColumn,
    startEditingTask,
    deleteTask,
    stopEditingTask,
    editTask,
    handleDragStart,
    handleDragCancel,
    handleDragEnd,
    handleDragOver,
  } = useKanban(kanbanData, boardId);

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 10 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <div className="min-h-screen flex flex-col">
      <p className="pt-3 pl-5">
        <Link href="/board" className="underline">
          board
        </Link>{' '}
        / {slug}
      </p>
      <div className="flex-1 min-h-0 flex flex-col">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragEnd={handleDragEnd}
          onDragStart={handleDragStart}
          onDragCancel={handleDragCancel}
          onDragOver={handleDragOver}
          id="unique-dnd-context-id"
        >
          <div className="p-5 flex-1 min-h-0 flex gap-5 overflow-x-auto w-full">
            {sortedColumns.map((area) => {
              return (
                <ColumnComponent
                  key={area.id}
                  id={area.id}
                  area={area}
                  editArea={editColumn}
                  deleteArea={deleteColumn}
                  moveColumn={moveColumn}
                  editingTaskId={editingTaskId}
                  startEditingTask={startEditingTask}
                  stopEditingTask={stopEditingTask}
                  editTask={editTask}
                  deleteTask={deleteTask}
                  addTask={addTask}
                />
              );
            })}
            <button
              className="rounded-lg border border-gray-200 px-4 py-3 bg-gray-50 text-neutral-600 hover:bg-gray-100 transition h-7 flex items-center justify-center cursor-pointer shadow-2xs shrink-0 whitespace-nowrap"
              type="button"
              onClick={() => {
                addColumn();
              }}
            >
              + Column
            </button>
          </div>
          <DragOverlay>
            {draggingTaskId !== null ? (
              <TaskCard
                task={activeTask!}
                editingTaskId={''}
                startEditingTask={() => {}}
                stopEditingTask={() => {}}
                editTask={() => {}}
                deleteTask={() => {}}
              />
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}
