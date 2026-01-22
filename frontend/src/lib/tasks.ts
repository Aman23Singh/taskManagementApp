import { apiFetch } from "./api";
import {
  Task,
  TaskListResponse,
  CreateTaskInput,
  UpdateTaskInput,
  TaskFilters,
} from "@/types";

export const taskApi = {
  list: async (filters: TaskFilters = {}): Promise<TaskListResponse> => {
    const params = new URLSearchParams();
    
    if (filters.page) params.set("page", filters.page.toString());
    if (filters.pageSize) params.set("pageSize", filters.pageSize.toString());
    if (filters.status) params.set("status", filters.status);
    if (filters.q) params.set("q", filters.q);

    const queryString = params.toString();
    const endpoint = `/tasks${queryString ? `?${queryString}` : ""}`;
    
    return apiFetch<TaskListResponse>(endpoint);
  },

  get: async (id: string): Promise<Task> => {
    return apiFetch<Task>(`/tasks/${id}`);
  },

  create: async (data: CreateTaskInput): Promise<Task> => {
    return apiFetch<Task>("/tasks", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: UpdateTaskInput): Promise<Task> => {
    return apiFetch<Task>(`/tasks/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string): Promise<void> => {
    await apiFetch<{ message: string }>(`/tasks/${id}`, {
      method: "DELETE",
    });
  },

  toggle: async (id: string): Promise<Task> => {
    return apiFetch<Task>(`/tasks/${id}/toggle`, {
      method: "POST",
    });
  },
};
