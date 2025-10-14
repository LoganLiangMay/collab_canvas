export interface CursorPosition {
  x: number;
  y: number;
  userId: string;
  userName: string;
  color: string;
  timestamp: number;
}

export interface CursorsState {
  [userId: string]: CursorPosition;
}


