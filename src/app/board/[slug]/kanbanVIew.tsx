'use client';

import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { TaskCard } from '../../components/TaskCard';
import Column from '../../components/Column';
import { useKanban } from '../../../hooks/useKanban';
import { CardArea } from '@/types/types';

interface KanbanViewProps {
  slug: string;
  kanbanData: CardArea[];
}

export function KanbanView({ slug, kanbanData }: KanbanViewProps) {
  const {
    kanban,
    editingTaskId,
    draggingTaskId,
    activeTask,
    addTask,
    addArea,
    editArea,
    deleteArea,
    startEditingTask,
    deleteTask,
    stopEditingTask,
    editTask,
    handleDragStart,
    handleDragCancel,
    handleDragEnd,
    handleDragOver,
  } = useKanban(kanbanData);

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 10 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <div className="min-h-screen flex flex-col">
      <p className="pt-3 pl-5">Board: {slug}</p>
      <div className="flex-1 min-h-0 flex flex-col">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          onDragStart={handleDragStart}
          onDragCancel={handleDragCancel}
          onDragOver={handleDragOver}
          id="unique-dnd-context-id"
        >
          <div className="p-5 flex-1 min-h-0 flex gap-5 overflow-x-auto w-full">
            {kanban.map((area) => {
              return (
                <Column
                  key={area.id}
                  id={area.id}
                  area={area}
                  editArea={editArea}
                  deleteArea={deleteArea}
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
              className="rounded border border-neutral-300 px-4 py-3 bg-white text-neutral-600 hover:bg-neutral-100 transition h-7 flex items-center justify-center cursor-pointer"
              type="button"
              onClick={() => {
                addArea();
              }}
            >
              + Area
            </button>
          </div>
          <DragOverlay>
            {draggingTaskId !== null ? (
              <TaskCard
                task={activeTask!}
                editingTaskId={-1}
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
