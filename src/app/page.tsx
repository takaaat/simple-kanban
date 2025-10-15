'use client';

import { useState } from 'react';
import { CardBox } from '@/components/CardBox';
import { TaskCard } from '@/components/TaskCard';
import type { CardArea, Task } from '../types/types';
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverlay,
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
import { insertAtIndex, removeAtIndex } from './utils/array';

export default function Home() {
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

  function handleDragStart(event) {
    const { active } = event;
    setActiveId(active.id);
  }

  function handleDragEnd(event) {
    const { active, over } = event;
    setActiveId(null);
  }

  function handleDragCancel(event) {
    setActiveId(null);
  }

  function handleDragOver({ active, over }) {
    const overId = over?.id;
    if (!overId) {
      return;
    }
    const activeContainer = active.data.current.sortable.index;
    const overContainer = over.data.current?.sortable.index || over.id;
    if (activeContainer !== overContainer) {
      console.log(overContainer);
      console.log(over.data.current);
      setKanban((kanban) => {
        const activeIndex = active.data.current.sortable.index;
        const overIndex =
          over.id in kanban
            ? kanban[overContainer].length + 1
            : over.data.current.sortable.index;
        return kanban;
        return moveBetweenContainers(
          kanban,
          activeContainer,
          activeIndex,
          overContainer,
          overIndex,
          active.id
        );
      });
    }
  }

  const moveBetweenContainers = (
    items,
    activeContainer,
    activeIndex,
    overContainer,
    overIndex,
    item
  ) => {
    return {
      ...items,
      [activeContainer]: removeAtIndex(items[activeContainer], activeIndex),
      [overContainer]: insertAtIndex(items[overContainer], overIndex, item),
    };
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
      onDragCancel={handleDragCancel}
      onDragOver={handleDragOver}
    >
      <div className="">
        {kanban.map((area) => {
          return <Droppable key={area.id} id={area.id} items={area.tasks} />;
        })}
      </div>
      <DragOverlay>
        {activeId ? <Item id={activeId} task={activeTask!} /> : null}
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
