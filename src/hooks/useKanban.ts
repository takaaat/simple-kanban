'use client';

import {
  startTransition,
  useEffect,
  useOptimistic,
  useRef,
  useState,
} from 'react';
import type { Column, Task } from '../types/types';
import {
  type Active,
  type Over,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import {
  addColumnAction,
  addTaskAction,
  deleteColumnAction,
  deleteTaskAction,
  renameColumnAction,
  renameTaskAction,
} from './actions';
import { LexoRank } from 'lexorank';

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

  const uncomittedUpdateTasks = useRef<Task[]>([]);

  function addColumn(name: string = 'New Area') {
    startTransition(async () => {
      let newRank = LexoRank.middle().format();
      if (kanban.length) {
        const sortedColumn = kanban.sort((a, b) =>
          a.sort_rank.localeCompare(b.sort_rank)
        );
        const lastColumn = sortedColumn.at(-1);
        newRank = LexoRank.parse(lastColumn!.sort_rank).genNext().format();
      }
      const newId = self.crypto.randomUUID();
      const newArea: Column = {
        id: newId,
        name: name,
        tasks: [],
        board_id: boardId,
        sort_rank: newRank,
      };
      addKanbanOptimistic([...kanban, newArea]);
      const succeed = await addColumnAction(boardId, newArea);
      if (succeed) {
        setKanban([...kanban, newArea]);
      }
    });
  }

  function addTask(areaId: string, name: string = 'New Task') {
    startTransition(async () => {
      const newId = self.crypto.randomUUID();
      const newTask: Task = {
        id: newId,
        name: name,
        column_id: areaId,
        sort_rank: '',
      };
      addKanbanOptimistic(
        // TODO: setStateと全体的に重複しているので直したい
        kanban.map((column) => {
          if (column.id === areaId) {
            return {
              ...column,
              tasks: [...column.tasks, newTask],
            };
          }
          return column;
        })
      );
      const succeed = await addTaskAction(newTask);
      if (!succeed) {
        return;
      }
      setKanban(
        kanban.map((column) => {
          if (column.id === areaId) {
            return {
              ...column,
              tasks: [...column.tasks, newTask],
            };
          }
          return column;
        })
      );
    });
  }

  function deleteColumn(columnId: string) {
    startTransition(async () => {
      addKanbanOptimistic(kanban.filter((column) => column.id !== columnId));
      const succeed = await deleteColumnAction(columnId);
      if (succeed) {
        setKanban(kanban.filter((column) => column.id !== columnId));
      }
    });
  }

  function editColumn(columnId: string, newName: string) {
    startTransition(async () => {
      addKanbanOptimistic(
        kanban.map((column) => {
          if (column.id === columnId) {
            return { ...column, name: newName };
          }
          return column;
        })
      );
      const succeed = await renameColumnAction(columnId, newName);
      if (!succeed) {
        return;
      }
      setKanban(
        kanban.map((column) => {
          if (column.id === columnId) {
            return { ...column, name: newName };
          }
          return column;
        })
      );
    });
  }

  function startEditingTask(id: string) {
    setEditingTaskId(id);
  }

  function deleteTask(taskId: string) {
    startTransition(async () => {
      addKanbanOptimistic(
        kanban.map((column) => {
          return {
            ...column,
            tasks: column.tasks.filter((task) => task.id !== taskId),
          };
        })
      );
      const succeed = await deleteTaskAction(taskId);
      if (!succeed) {
        return;
      }
      setKanban(
        kanban.map((column) => {
          return {
            ...column,
            tasks: column.tasks.filter((task) => task.id !== taskId),
          };
        })
      );
    });
  }

  function stopEditingTask() {
    setEditingTaskId('');
  }

  function editTask(targetTask: Task, newName: string) {
    const isExist = uncomittedUpdateTasks.current.some(
      (task) => task.id === targetTask.id
    );
    if (isExist) {
      uncomittedUpdateTasks.current = uncomittedUpdateTasks.current.map(
        (task) => {
          if (task.id !== targetTask.id) {
            return task;
          }
          return { ...task, name: newName };
        }
      );
    } else {
      uncomittedUpdateTasks.current = [
        { ...targetTask, name: newName },
        ...uncomittedUpdateTasks.current,
      ];
    }
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

  useEffect(() => {
    const tasksToProcess = [...uncomittedUpdateTasks.current];
    uncomittedUpdateTasks.current = [];
    if (tasksToProcess.length === 0) return;
    (async () => {
      try {
        await Promise.all(
          tasksToProcess.map((task) => renameTaskAction(task.id, task.name))
        );
      } catch (error) {
        console.error(error);
      }
    })();
  }, [editingTaskId]);

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
    addArea: addColumn,
    deleteArea: deleteColumn,
    editArea: editColumn,
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
