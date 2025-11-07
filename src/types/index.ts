export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Card {
  id: string;
  title: string;
  description: string;
  columnId: string;
  position: number;
}

export interface Column {
  id: string;
  title: string;
  position: number;
}

export interface Board {
  id: string;
  title: string;
  columns: Column[];
  cards: Card[];
}