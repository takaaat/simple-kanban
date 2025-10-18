'use client';

import { useState } from 'react';
import { CardBox } from '@/components/CardBox';
import { TaskCard } from '@/components/TaskCard';
import type { CardArea, Task } from '../types/types';
import {
  closestCenter,
  DndContext,
  DragCancelEvent,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableItem } from './components/SortableItem';
import { Item } from './components/Item';
import Droppable from './components/Droppable';
import { createFromNextReadableStream } from 'next/dist/client/components/router-reducer/fetch-server-response';

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

  const [activeId, setActiveId] = useState(null);
  const activeTask = kanban
    .flatMap((area) => area.tasks)
    .find((task) => task.id === activeId);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    setActiveId(active.id);
  }

  function handleDragCancel(event: DragCancelEvent) {
    setActiveId(null);
  }

  function handleDragEnd({ active, over }: { active: any; over: any }) {
    setKanban((prevKanban) =>
      moveTaskBetweenKanban({ active, over, kanban: prevKanban })
    );
    setActiveId(null);
  }

  function moveTaskBetweenKanban(params: {
    active: any;
    over: any;
    kanban: CardArea[];
  }): CardArea[] {
    const { active, over, kanban } = params;
    if (!over) {
      return kanban;
    }
    const activeContainer = active.data.current.sortable.containerId;
    const overContainer = over.data.current?.sortable.containerId || over.id;
    if (active.id !== over.id) {
      const activeIndex = active.data.current.sortable.index;
      const overIndex = kanban.some((area) => area.id === over.id)
        ? kanban.find((area) => area.id === overContainer)!.tasks.length + 1
        : over.data.current.sortable.index;

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

  function handleDragOver({ active, over }: { active: any; over: any }) {
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
          return <Droppable key={area.id} id={area.id} items={area.tasks} />;
        })}
      </div>
      <DragOverlay>
        {activeId !== null ? <Item id={activeId} task={activeTask!} /> : null}
      </DragOverlay>
    </DndContext>
  );
}

export function oldHome() {
  const data: CardArea[] = [
    {
      id: 0,
      name: 'area1',
      tasks: [
        { id: 0, name: 'taskname' },
        { id: 1, name: 'taskname2' },
      ],
    },
    { id: 1, name: 'area2', tasks: [{ id: 2, name: 'taskname3' }] },
  ];

  const [kanban, setKanban] = useState<CardArea[]>(data);
  const [editing, setEditing] = useState<number>(-1);

  function addTask(area: CardArea, name: string) {
    const newId = Date.now();
    setKanban(
      kanban.map((currentArea) => {
        if (currentArea.id === area.id) {
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

  function handleDelete(id: number) {
    setKanban(
      kanban.map((area) => {
        return { ...area, tasks: area.tasks.filter((task) => task.id !== id) };
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

  function handledragEnd(event: DragEndEvent) {
    if (!event.over) {
      return;
    }
  }

  return (
    <DndContext onDragEnd={handledragEnd}>
      <div className="p-5 flex gap-5 overflow-x-auto w-full">
        {kanban.map((area) => {
          return (
            <CardBox
              name={area.name}
              key={area.id}
              id={area.id}
              onAdd={() => addTask(area, 'aaa')}
            >
              {area.tasks.map((task) => {
                return (
                  <TaskCard
                    key={task.id}
                    id={task.id}
                    task={task}
                    editing={editing}
                    onClick={() => setEditingFocus(task.id)}
                    unFocus={unFocus}
                    onChange={editTask}
                    handleDelete={() => handleDelete(task.id)}
                  />
                );
              })}
            </CardBox>
          );
        })}
      </div>
    </DndContext>
  );
}
