'use client';

import { startTransition, useOptimistic, useState } from 'react';
import type { Column, Task } from '../types/types';
import {
  type Active,
  type Over,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { addAreaAction } from './actions';

export function useKanban(initialKanbanData: Column[], boardId: string) {
  const [kanban, setKanban] = useState<Column[]>(initialKanbanData);
  const [optimisticKanbanState, addKanbanOptimistic] = useOptimistic(
    kanban,
    (currentState, newState: Column[]) => {
      return newState;
    }
  );

  const [editingTaskId, setEditingTaskId] = useState<string>('');
  const [draggingTaskId, setDraggingTaskId] = useState<number | string | null>(
    null
  );

  function addArea(name: string = 'New Area') {
    startTransition(async () => {
      const newId = self.crypto.randomUUID();
      const newArea: Column = {
        id: newId,
        name: name,
        tasks: [],
        board_id: boardId,
        sort_order: 0,
      };
      addKanbanOptimistic([...kanban, newArea]);
      await addAreaAction(boardId, newArea);
      setKanban([...kanban, newArea]);
    });
  }

  function addTask(areaId: string, name: string = 'New Task') {
    const newId = self.crypto.randomUUID();
    setKanban(
      kanban.map((column) => {
        if (column.id === areaId) {
          return {
            ...column,
            tasks: [
              ...column.tasks,
              { id: newId, name: name, column_id: column.id, sort_order: 0 },
            ],
          };
        }
        return column;
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

  function startEditingTask(id: string) {
    setEditingTaskId(id);
  }

  function deleteTask(taskId: string) {
    setKanban(
      kanban.map((area) => {
        return {
          ...area,
          cards: area.tasks.filter((task) => task.id !== taskId),
        };
      })
    );
  }

  function stopEditingTask() {
    setEditingTaskId('');
  }

  function editTask(targetTask: Task, newName: string) {
    setKanban(
      kanban.map((currentArea) => {
        return {
          ...currentArea,
          tasks: currentArea.tasks.map((task) => {
            console.log(task);
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
    kanban: Column[];
  }): Column[] {
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

      let newKanban: Column[];
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
            const newcards = [...area.tasks];
            newcards.splice(overIndex, 0, currentActiveTask!);
            return {
              ...area,
              tasks: newcards,
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
    optimisticKanbanState,
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
