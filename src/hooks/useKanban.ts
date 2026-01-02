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

  const sortedColumns = optimisticKanbanState
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

  function addColumn(name: string = 'New Area') {
    startTransition(async () => {
      let newRank = LexoRank.middle().format();
      if (kanban.length) {
        const sortedColumn = kanban.toSorted((a, b) =>
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

  function addTask(columnId: string, name: string = 'New Task') {
    startTransition(async () => {
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
      addKanbanOptimistic(
        // TODO: setStateと全体的に重複しているので直したい
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
      const succeed = await addTaskAction(newTask);
      if (!succeed) {
        return;
      }
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
      moveTaskBetweenKanban({ active, over, kanban: prevKanban })
    );
  }

  function lexoTaskMove(
    tasks: Task[],
    columnId: string,
    activeSortedIndex: number,
    overSortedIndex: number
  ): Task[] {
    const currentColumnFromSorted = sortedColumns.find(
      (column) => column.id === columnId
    );

    if (!currentColumnFromSorted) {
      throw new Error('対応するColumnが見つからない');
    }

    let prevIndex: number;
    let nextIndex: number;
    if (activeSortedIndex > overSortedIndex) {
      prevIndex = overSortedIndex - 1;
      nextIndex = overSortedIndex;
    } else {
      prevIndex = overSortedIndex;
      nextIndex = overSortedIndex + 1;
    }

    const activeFromSorted = currentColumnFromSorted.tasks[activeSortedIndex];
    const prevTask = currentColumnFromSorted.tasks[prevIndex];
    const nextTask = currentColumnFromSorted.tasks[nextIndex];

    let newRank: string;

    if (!prevTask && !nextTask) {
      newRank = LexoRank.middle().format();
    } else if (!prevTask) {
      newRank = LexoRank.parse(nextTask.sort_rank).genPrev().format();
    } else if (!nextTask) {
      newRank = LexoRank.parse(prevTask.sort_rank).genNext().format();
    } else {
      newRank = LexoRank.parse(prevTask.sort_rank)
        .between(LexoRank.parse(nextTask.sort_rank))
        .format();
    }

    const newTasks: Task[] = [...tasks];
    return newTasks.map((task) => {
      if (task.id === activeFromSorted.id) {
        return {
          ...task,
          sort_rank: newRank,
        };
      }
      return task;
    });
  }

  function moveTaskBetweenColumn(
    kanban: Column[],
    activeContainer: string,
    overContainer: string,
    activeIndex: number,
    overIndex: number
  ): Column[] {
    const activeColumn = sortedColumns.find(
      (column) => column.id === activeContainer
    );

    const overColumn = sortedColumns.find(
      (column) => column.id === overContainer
    );

    if (!activeColumn || !overColumn) {
      throw new Error('対応するColumnが見つからない');
    }

    const currentActiveTask = activeColumn
      ? activeColumn.tasks[activeIndex]
      : undefined;

    const activeFromSorted = activeColumn.tasks[activeIndex];
    const prevTask = overColumn.tasks[overIndex - 1];
    const nextTask = overColumn.tasks[overIndex];

    console.log(overIndex);
    console.log(prevTask);
    console.log(nextTask);

    let newRank: string;

    if (!prevTask && !nextTask) {
      newRank = LexoRank.middle().format();
    } else if (!prevTask) {
      newRank = LexoRank.parse(nextTask.sort_rank).genPrev().format();
    } else if (!nextTask) {
      newRank = LexoRank.parse(prevTask.sort_rank).genNext().format();
    } else {
      newRank = LexoRank.parse(prevTask.sort_rank)
        .between(LexoRank.parse(nextTask.sort_rank))
        .format();
    }

    const newKanban = kanban.map((column) => {
      if (column.id === activeContainer) {
        return {
          ...column,
          tasks: column.tasks.filter((task) => task.id !== activeFromSorted.id),
        };
      }
      if (column.id === overContainer) {
        return {
          ...column,
          tasks: [
            ...column.tasks,
            {
              ...currentActiveTask!,
              column_id: column.id,
              sort_rank: newRank,
            },
          ],
        };
      }
      return column;
    });
    return newKanban;
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
      const activeIndex: number = active.data.current.sortable.index;
      const overIndex: number = kanban.some((area) => area.id === over.id)
        ? kanban.find((area) => area.id === overContainer)!.tasks.length
        : over.data.current!.sortable.index;

      let newKanban: Column[];
      if (activeContainer === overContainer) {
        const currentArea = kanban.find((area) => area.id === activeContainer);
        if (!currentArea) {
          return kanban;
        }
        console.log('column内部での移動');
        newKanban = kanban.map((area) => {
          if (area.id !== currentArea.id) {
            return area;
          }
          return {
            ...area,
            tasks: lexoTaskMove(area.tasks, area.id, activeIndex, overIndex),
          };
        });
        return newKanban;
      } else {
        console.log('columm外部での移動');

        return moveTaskBetweenColumn(
          kanban,
          activeContainer,
          overContainer,
          activeIndex,
          overIndex
        );
      }
    }
    return kanban;
  }

  return {
    sortedColumns,
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
