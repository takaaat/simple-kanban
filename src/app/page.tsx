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
import { TaskCard } from './components/TaskCard';
import Column from './components/Column';
import { useKanban } from '../hooks/useKanban';

export default function Home() {
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
  } = useKanban();

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 10 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
      onDragCancel={handleDragCancel}
      onDragOver={handleDragOver}
      id="unique-dnd-context-id"
    >
      <div className="p-5 flex gap-5 overflow-x-auto w-full">
        {kanban.map((area) => {
          return (
            <Column
              key={area.id}
              id={area.id}
              area={area}
              editArea={editArea}
              deleteArea={deleteArea}
              editing={editingTaskId}
              onCardClick={startEditingTask}
              unFocus={stopEditingTask}
              onTaskChange={editTask}
              handleTaskDelete={deleteTask}
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
            editing={-1}
            onCardClick={() => {}}
            unFocus={() => {}}
            onTaskChange={() => {}}
            handleTaskDelete={() => {}}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
