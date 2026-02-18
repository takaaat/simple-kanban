'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Column, Task } from '../types/types';
import {
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from '@dnd-kit/core';
import {
  addColumnAction,
  addTaskAction,
  deleteColumnAction,
  deleteTaskAction,
  moveColumnAction,
  moveTaskAction,
  renameColumnAction,
  renameTaskAction,
} from './actions';
import { LexoRank } from 'lexorank';
import { moveKanbanTask } from '@/utils/lexorank';

export function useKanban(initialKanbanData: Column[], boardId: string) {
  const router = useRouter();
  const [kanban, setKanban] = useState<Column[]>(initialKanbanData);

  // db処理に失敗してrouter.refreshされたときのserver component更新時
  useEffect(() => {
    setKanban(initialKanbanData);
  }, [initialKanbanData]);

  const sortedColumns = kanban
    .toSorted((a, b) => a.sort_rank.localeCompare(b.sort_rank))
    .map((column) => ({
      ...column,
      tasks: [...column.tasks].sort((a, b) =>
        a.sort_rank.localeCompare(b.sort_rank)
      ),
    }));

  const [editingTaskId, setEditingTaskId] = useState<string>('');
  const [draggingTaskId, setDraggingTaskId] = useState<number | string | null>(
    null
  );

  const uncomittedUpdateTasks = useRef<Task[]>([]);

  async function addColumn(name: string = 'New Area') {
    let newRank = LexoRank.middle().format();
    if (kanban.length) {
      const sortedColumn = kanban.toSorted((a, b) =>
        a.sort_rank.localeCompare(b.sort_rank)
      );
      const lastColumn = sortedColumn.at(-1);
      newRank = LexoRank.parse(lastColumn!.sort_rank).genNext().format();
    }
    const newId = self.crypto.randomUUID();
    const newColumn: Column = {
      id: newId,
      name: name,
      tasks: [],
      board_id: boardId,
      sort_rank: newRank,
    };
    setKanban([...kanban, newColumn]);
    const succeed = await addColumnAction(boardId, newColumn);
    if (!succeed) {
      router.refresh();
    }
  }

  async function addTask(columnId: string, name: string = '') {
    const column = kanban.find((column) => column.id == columnId);
    if (!column) {
      return;
    }
    let newRank = LexoRank.middle().format();
    if (column.tasks.length) {
      const sortedTasks: Task[] = column.tasks.toSorted((a, b) =>
        a.sort_rank.localeCompare(b.sort_rank)
      );
      const lastTask = sortedTasks.at(-1);
      newRank = LexoRank.parse(lastTask!.sort_rank).genNext().format();
    }
    const newId = self.crypto.randomUUID();
    const newTask: Task = {
      id: newId,
      name: name,
      column_id: columnId,
      sort_rank: newRank,
    };
    setKanban(
      kanban.map((column) => {
        if (column.id === columnId) {
          return {
            ...column,
            tasks: [...column.tasks, newTask],
          };
        }
        return column;
      })
    );

    setEditingTaskId(newId);

    const succeed = await addTaskAction(newTask);
    if (!succeed) {
      router.refresh();
    }
  }

  async function deleteColumn(columnId: string) {
    setKanban(kanban.filter((column) => column.id !== columnId));
    const succeed = await deleteColumnAction(columnId);
    if (!succeed) {
      router.refresh();
    }
  }

  async function moveColumn(columnId: string, newPosition: number) {
    const currentColumnPosition = sortedColumns.findIndex(
      (column) => column.id === columnId
    );
    let prevIndex: number;
    let nextIndex: number;
    if (currentColumnPosition > newPosition) {
      prevIndex = newPosition - 1;
      nextIndex = newPosition;
    } else {
      prevIndex = newPosition;
      nextIndex = newPosition + 1;
    }

    const prevColumn =
      prevIndex === currentColumnPosition
        ? sortedColumns[prevIndex - 1]
        : sortedColumns[prevIndex];
    const nextColumn =
      nextIndex === currentColumnPosition
        ? sortedColumns[nextIndex + 1]
        : sortedColumns[nextIndex];

    let newRank: string;

    if (!prevColumn && !nextColumn) {
      return;
    } else if (!prevColumn) {
      newRank = LexoRank.parse(nextColumn.sort_rank).genPrev().format();
    } else if (!nextColumn) {
      newRank = LexoRank.parse(prevColumn.sort_rank).genNext().format();
    } else {
      newRank = LexoRank.parse(prevColumn.sort_rank)
        .between(LexoRank.parse(nextColumn.sort_rank))
        .format();
    }

    setKanban(
      kanban.map((column) => {
        if (column.id === columnId) {
          return { ...column, sort_rank: newRank };
        }
        return column;
      })
    );
    const succeed = await moveColumnAction(columnId, newRank);
    if (!succeed) {
      router.refresh();
    }
  }

  async function editColumn(columnId: string, newName: string) {
    setKanban(
      kanban.map((column) => {
        if (column.id === columnId) {
          return { ...column, name: newName };
        }
        return column;
      })
    );
    const succeed = await renameColumnAction(columnId, newName);
    if (!succeed) {
      router.refresh();
    }
  }

  function startEditingTask(id: string) {
    setEditingTaskId(id);
  }

  async function deleteTask(taskId: string) {
    setKanban(
      kanban.map((column) => {
        return {
          ...column,
          tasks: column.tasks.filter((task) => task.id !== taskId),
        };
      })
    );
    const succeed = await deleteTaskAction(taskId);
    if (!succeed) {
      router.refresh();
    }
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
      kanban.map((currentColumn) => {
        return {
          ...currentColumn,
          tasks: currentColumn.tasks.map((task) => {
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
    .flatMap((column) => column.tasks)
    .find((task) => task.id === draggingTaskId);

  function handleDragStart({ active }: DragStartEvent) {
    setDraggingTaskId(active.id);
  }
  function handleDragCancel() {
    setDraggingTaskId(null);
  }

  async function handleDragEnd({ active, over }: DragEndEvent) {
    setDraggingTaskId(null);
    const newKanban = moveKanbanTask({
      active,
      over,
      kanban: kanban,
      sortedColumns: sortedColumns,
    });
    const updatedTaskId = active.id.toString();
    let updatedTask: Task | undefined;
    newKanban.forEach((column) => {
      if (!updatedTask) {
        updatedTask = column.tasks.find((task) => task.id === updatedTaskId);
      }
    });
    if (updatedTask) {
      setKanban(newKanban);
      const succeed = await moveTaskAction(
        updatedTaskId,
        updatedTask.sort_rank,
        updatedTask.column_id
      );
      if (!succeed) {
        router.refresh();
      }
    }
  }

  function handleDragOver({ active, over }: DragOverEvent) {
    if (over === null || !active.data.current) {
      return kanban;
    }
    const activeContainer = active.data.current.sortable.containerId;
    const overContainer = over.data.current?.sortable.containerId || over.id;
    if (activeContainer === overContainer) {
      return;
    }
    setKanban((prevKanban) =>
      moveKanbanTask({
        active,
        over,
        kanban: prevKanban,
        sortedColumns: sortedColumns,
      })
    );
  }

  return {
    sortedColumns,
    editingTaskId,
    draggingTaskId,
    activeTask,
    addTask,
    addColumn,
    deleteColumn,
    moveColumn,
    editColumn,
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
