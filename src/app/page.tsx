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
import { Item } from './components/Item';
import Droppable from './components/Droppable';
import { useKanban } from '../hooks/useKanban';

export default function Home() {
  const {
    kanban,
    editing,
    activeId,
    activeTask,
    addTask,
    addArea,
    setEditingFocus,
    handleDelete,
    unFocus,
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
            <Droppable
              key={area.id}
              id={area.id}
              area={area}
              editing={editing}
              onClick={setEditingFocus}
              unFocus={unFocus}
              onTaskChange={editTask}
              handleDelete={handleDelete}
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
        {activeId !== null ? (
          <Item
            task={activeTask!}
            editing={-1}
            onClick={() => {}}
            unFocus={() => {}}
            onTaskChange={() => {}}
            handleDelete={() => {}}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
