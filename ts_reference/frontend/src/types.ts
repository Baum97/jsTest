// Gespiegelt zum Backend – in einem Monorepo würde man diese Typen teilen.

export type Priority = "low" | "medium" | "high";

export interface Task {
  id: number;
  title: string;
  done: boolean;
  priority: Priority;
  createdAt: string;
}

export interface PaginatedTasks {
  data: Task[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface TaskStats {
  total: number;
  done: number;
  open: number;
}
