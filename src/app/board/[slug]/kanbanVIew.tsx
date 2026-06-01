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
import EditButtonAndModal from './EditButtonAndModal';

interface KanbanViewProps {
  slug: string;
  title: string;
  boardId: string;
  kanbanData: Column[];
}

export function KanbanView({
  slug,
  boardId,
  title,
  kanbanData,
}: KanbanViewProps) {
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
    <div className="min-h-screen flex flex-col bg-blue-600">
      <div className="bg-blue-700 flex justify-between py-2 px-5 font-bold">
        <p className="text-blue-100">
          <Link href="/board" className="underline">
            board
          </Link>{' '}
          / {slug} {title}
        </p>
        <EditButtonAndModal
          currentSlug={slug}
          currentTitle={title}
          boardId={boardId}
        />
      </div>
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
              className="rounded-lg px-6 py-5 bg-blue-500 text-gray-200 hover:bg-blue-700 transition h-7 flex items-center justify-center cursor-pointer shadow-2xs shrink-0 whitespace-nowrap font-semibold"
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
