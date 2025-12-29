'use client';
import { useState } from 'react';
import type { CardArea, Task } from '../types/types';
import {
  type Active,
  type Over,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';

export function useKanban(initialKanbanData: CardArea[]) {
  const [kanban, setKanban] = useState<CardArea[]>(initialKanbanData);
  const [editingTaskId, setEditingTaskId] = useState<number>(-1);
  const [draggingTaskId, setDraggingTaskId] = useState<number | string | null>(
    null
  );

  function addArea(name: string = 'New Area') {
    const newId = Date.now().toString();
    const newArea: CardArea = { id: newId, name: name, tasks: [] };
    setKanban([...kanban, newArea]);
  }

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

  function deleteArea(areaId: string) {
    setKanban(kanban.filter((area) => area.id !== areaId));
  }

  function editArea(areaId: string, newName: string) {
    setKanban(
      kanban.map((area) => {
        if (area.id === areaId) {
          return { ...area, name: newName };
        }
        return area;
      })
    );
  }

  function startEditingTask(id: number) {
    setEditingTaskId(id);
  }

  function deleteTask(taskId: number) {
    setKanban(
      kanban.map((area) => {
        return {
          ...area,
          tasks: area.tasks.filter((task) => task.id !== taskId),
        };
      })
    );
  }

  function stopEditingTask() {
    setEditingTaskId(-1);
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
    .find((task) => task.id === draggingTaskId);

  function handleDragStart({ active }: DragStartEvent) {
    setDraggingTaskId(active.id);
  }
  function handleDragCancel() {
    setDraggingTaskId(null);
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    setKanban((prevKanban) =>
      moveTaskBetweenKanban({ active, over, kanban: prevKanban })
    );
    setDraggingTaskId(null);
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

  return {
    kanban,
    editingTaskId,
    draggingTaskId,
    activeTask,
    addTask,
    addArea,
    deleteArea,
    editArea,
    startEditingTask,
    deleteTask,
    stopEditingTask,
    editTask,
    handleDragStart,
    handleDragCancel,
    handleDragEnd,
    handleDragOver,
  };
}
