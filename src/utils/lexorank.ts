import { Column, Task } from '@/types/types';
import { Active, Over } from '@dnd-kit/core';
import { LexoRank } from 'lexorank';

export function lexoTaskMove(
  tasks: Task[],
  sortedColumns: Column[],
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

  const activeFromSorted = currentColumnFromSorted.tasks[activeSortedIndex];

  let prevIndex: number;
  let nextIndex: number;
  if (activeSortedIndex > overSortedIndex) {
    prevIndex = overSortedIndex - 1;
    nextIndex = overSortedIndex;
  } else {
    prevIndex = overSortedIndex;
    nextIndex = overSortedIndex + 1;
  }

  const prevTask =
    prevIndex === activeSortedIndex
      ? currentColumnFromSorted.tasks[prevIndex - 1]
      : currentColumnFromSorted.tasks[prevIndex];
  const nextTask =
    nextIndex === activeSortedIndex
      ? currentColumnFromSorted.tasks[nextIndex + 1]
      : currentColumnFromSorted.tasks[nextIndex];

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

export function moveTaskBetweenColumn(
  kanban: Column[],
  sortedColumns: Column[],
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

export function moveKanbanTask(params: {
  sortedColumns: Column[];
  active: Active;
  over: Over | null;
  kanban: Column[];
}): Column[] {
  const { sortedColumns, active, over, kanban } = params;
  if (over === null || !active.data.current) {
    return kanban;
  }
  const activeContainer = active.data.current.sortable.containerId;
  const overContainer = over.data.current?.sortable.containerId || over.id;
  if (active.id !== over.id) {
    const activeIndex: number = active.data.current.sortable.index;
    const overIndex: number = kanban.some((column) => column.id === over.id)
      ? kanban.find((column) => column.id === overContainer)!.tasks.length
      : over.data.current!.sortable.index;

    let newKanban: Column[];
    if (activeContainer === overContainer) {
      const currentColumn = kanban.find(
        (column) => column.id === activeContainer
      );
      if (!currentColumn) {
        return kanban;
      }
      newKanban = kanban.map((column) => {
        if (column.id !== currentColumn.id) {
          return column;
        }
        return {
          ...column,
          tasks: lexoTaskMove(
            column.tasks,
            sortedColumns,
            column.id,
            activeIndex,
            overIndex
          ),
        };
      });
      return newKanban;
    } else {
      return moveTaskBetweenColumn(
        kanban,
        sortedColumns,
        activeContainer,
        overContainer,
        activeIndex,
        overIndex
      );
    }
  }
  return kanban;
}
