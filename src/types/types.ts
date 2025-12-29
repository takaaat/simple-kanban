export type Board = {
  id: string;
  slug: string;
  user_id: string;
  title: string;
  columns: Column[];
};

export type Column = {
  id: string;
  name: string;
  board_id: string;
  sort_order: number;
  tasks: Task[];
};

export type Task = {
  id: string;
  name: string;
  column_id: string;
  sort_order: number;
};
