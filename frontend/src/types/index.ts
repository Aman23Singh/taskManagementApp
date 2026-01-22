export interface User {
  id: string;
  email: string;
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: "PENDING" | "IN_PROGRESS" | "DONE";
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskListResponse {
  items: Task[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  status?: "PENDING" | "IN_PROGRESS" | "DONE";
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: "PENDING" | "IN_PROGRESS" | "DONE";
}

export interface TaskFilters {
  page?: number;
  pageSize?: number;
  status?: "PENDING" | "IN_PROGRESS" | "DONE" | "";
  q?: string;
}
