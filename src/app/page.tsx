'use client';

import { useState } from 'react';
import type { CardArea, Task } from '../types/types';
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  MouseSensor,
  useSensor,
  useSensors,
  type Active,
  type Over,
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { Item } from './components/Item';
import Droppable from './components/Droppable';

export default function Home() {
  const data: CardArea[] = [
    {
      id: '0',
      name: 'area1',
      tasks: [
        { id: 0, name: 'taskname' },
        { id: 1, name: 'taskname2' },
      ],
    },
    { id: '1', name: 'area2', tasks: [{ id: 2, name: 'taskname3' }] },
    { id: '2', name: 'area3', tasks: [{ id: 3, name: 'taskname4' }] },
  ];

  const [kanban, setKanban] = useState<CardArea[]>(data);
  const [editing, setEditing] = useState<number>(-1);
  const [activeId, setActiveId] = useState<number | string | null>(null);

  function addTask(areaId: string, name: string = 'New Task') {
    const newId = Date.now();
    setKanban(
      kanban.map((currentArea) => {
        if (currentArea.id === areaId) {
          return {
            ...currentArea,
            tasks: [...currentArea.tasks, { id: newId, name: name }],
          };
        }
        return currentArea;
      })
    );
  }

  function setEditingFocus(id: number) {
    setEditing(id);
  }

  function handleDelete(taskId: number) {
    setKanban(
      kanban.map((area) => {
        return {
          ...area,
          tasks: area.tasks.filter((task) => task.id !== taskId),
        };
      })
    );
  }

  function unFocus() {
    setEditing(-1);
  }

  function editTask(targetTask: Task, newName: string) {
    setKanban(
      kanban.map((currentArea) => {
        return {
          ...currentArea,
          tasks: currentArea.tasks.map((task) => {
            if (task === targetTask) {
              return { ...task, name: newName };
            }
            return task;
          }),
        };
      })
    );
  }

  const activeTask = kanban
    .flatMap((area) => area.tasks)
    .find((task) => task.id === activeId);
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 10 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragStart({ active }: DragStartEvent) {
    setActiveId(active.id);
  }
  function handleDragCancel() {
    setActiveId(null);
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    setKanban((prevKanban) =>
      moveTaskBetweenKanban({ active, over, kanban: prevKanban })
    );
    setActiveId(null);
  }

  function moveTaskBetweenKanban(params: {
    active: Active;
    over: Over | null;
    kanban: CardArea[];
  }): CardArea[] {
    const { active, over, kanban } = params;
    if (over === null || !active.data.current) {
      return kanban;
    }
    const activeContainer = active.data.current.sortable.containerId;
    const overContainer = over.data.current?.sortable.containerId || over.id;
    if (active.id !== over.id) {
      const activeIndex = active.data.current.sortable.index;
      const overIndex = kanban.some((area) => area.id === over.id)
        ? kanban.find((area) => area.id === overContainer)!.tasks.length + 1
        : over.data.current!.sortable.index;

      let newKanban: CardArea[];
      if (activeContainer === overContainer) {
        const currentArea = kanban.find((area) => area.id === activeContainer);
        if (!currentArea) {
          return kanban;
        }
        newKanban = kanban.map((area) => {
          if (area.id !== currentArea.id) {
            return area;
          }
          return {
            ...area,
            tasks: arrayMove(area.tasks, activeIndex, overIndex),
          };
        });
        return newKanban;
      } else {
        const currentArea = kanban.find((area) => area.id === activeContainer);
        const currentActiveTask = currentArea
          ? currentArea.tasks[activeIndex]
          : undefined;
        const newKanban = kanban.map((area) => {
          if (area.id === activeContainer) {
            return {
              ...area,
              tasks: area.tasks.filter((_, i) => i !== activeIndex),
            };
          }
          if (area.id === overContainer) {
            const newTasks = [...area.tasks];
            newTasks.splice(overIndex, 0, currentActiveTask!);
            return {
              ...area,
              tasks: newTasks,
            };
          }
          return area;
        });
        return newKanban;
      }
    }
    return kanban;
  }

  function handleDragOver({ active, over }: DragOverEvent) {
    setKanban((prevKanban) =>
      moveTaskBetweenKanban({ active, over, kanban: prevKanban })
    );
  }

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
              items={area.tasks}
              editing={editing}
              onClick={setEditingFocus}
              unFocus={unFocus}
              onTaskChange={editTask}
              handleDelete={handleDelete}
              addTask={addTask}
            />
          );
        })}
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
