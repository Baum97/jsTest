// Domänen-Typen, an einer Stelle definiert und überall importiert.

export type Priority = "low" | "medium" | "high";

export interface Task {
  id: number;
  title: string;
  done: boolean;
  priority: Priority;
  createdAt: string;
}

// Daten zum Anlegen – wie ein Task, nur ohne die vom Server vergebene id.
export type NewTaskData = Omit<Task, "id">;
