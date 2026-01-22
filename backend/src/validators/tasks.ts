import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  status: z.enum(["PENDING", "IN_PROGRESS", "DONE"]).optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).optional(),
  status: z.enum(["PENDING", "IN_PROGRESS", "DONE"]).optional(),
});

export const listTasksSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
  status: z.enum(["PENDING", "IN_PROGRESS", "DONE"]).optional(),
  q: z.string().min(1).optional(),
});
