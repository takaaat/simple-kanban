import { describe, it, expect } from 'vitest';
import { lexoTaskMove } from './lexorank';
import { Column, Task } from '@/types/types';
import { LexoRank } from 'lexorank';

describe('lexorankの動作', () => {
  const rank0 = LexoRank.middle().format();
  const rank1 = LexoRank.parse(rank0).genNext().format();
  const rank2 = LexoRank.parse(rank1).genNext().format();
  const rank3 = LexoRank.parse(rank2).genNext().format();
  const rank4 = LexoRank.parse(rank3).genNext().format();

  const tasks: Task[] = [
    { id: '0', name: 't1', column_id: 'c0', sort_rank: rank0 },
    { id: '1', name: 't2', column_id: 'c0', sort_rank: rank1 },
    { id: '2', name: 't3', column_id: 'c0', sort_rank: rank2 },
    { id: '3', name: 't4', column_id: 'c0', sort_rank: rank3 },
    { id: '4', name: 't5', column_id: 'c0', sort_rank: rank4 },
  ];

  const columns: Column[] = [
    {
      id: 'c0',
      name: 'col',
      board_id: 'b0',
      sort_rank: LexoRank.middle().format(),
      tasks: tasks,
    },
  ];

  const cases = [
    {
      scenario: '端以外でtaskを上方向に移動可能か',
      activeSortedIndex: 2,
      overSortedIndex: 1,
      targetId: '2',
      expectedGreater: rank0,
      expectedLess: rank1,
    },
    {
      scenario: '端以外でtaskを下方向に移動可能か',
      activeSortedIndex: 1,
      overSortedIndex: 2,
      targetId: '1',
      expectedGreater: rank2,
      expectedLess: rank3,
    },
    {
      scenario: 'taskを一番上に移動可能か',
      activeSortedIndex: 2,
      overSortedIndex: 0,
      targetId: '2',
      expectedGreater: LexoRank.min().format(),
      expectedLess: rank0,
    },
    {
      scenario: 'taskを一番下に移動可能か',
      activeSortedIndex: 2,
      overSortedIndex: 4,
      targetId: '2',
      expectedGreater: rank4,
      expectedLess: LexoRank.max().format(),
    },
  ];

  it.each(cases)(
    '$scenario (active: $activeSortedIndex, over: $overSortedIndex)',
    ({
      activeSortedIndex,
      overSortedIndex,
      targetId,
      expectedGreater,
      expectedLess,
    }) => {
      const retTasks = lexoTaskMove(
        tasks,
        columns,
        'c0',
        activeSortedIndex,
        overSortedIndex
      );

      const movedTask = retTasks.find((task) => task.id === targetId);
      expect(movedTask).toBeDefined();

      expect(movedTask!.sort_rank > expectedGreater).toBe(true);
      expect(movedTask!.sort_rank < expectedLess).toBe(true);
    }
  );
});
