export type Board = {
  id: number;
  slug: string;
  user_id: string;
  title: string;
  columns: Column[];
};

export type Column = {
  id: string;
  name: string;
  board_id: number;
  sort_order: number;
  cards: Card[];
};

export type Card = {
  id: number;
  name: string;
  column_id: string;
  sort_order: number;
};
