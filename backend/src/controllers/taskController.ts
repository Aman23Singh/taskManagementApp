import type { Response } from "express";
import prisma from "../db.js";
import type { AuthRequest } from "../middleware/auth.js";
import { createTaskSchema, listTasksSchema, updateTaskSchema } from "../validators/tasks.js";

export const listTasks = async (req: AuthRequest, res: Response) => {
  const parsed = listTasksSchema.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid query", errors: parsed.error.flatten() });
  }

  const { page, pageSize, status, q } = parsed.data;
  const skip = (page - 1) * pageSize;

  const where = {
    userId: req.user!.id,
    ...(status ? { status } : {}),
    ...(q ? { title: { contains: q } } : {}),
  };

  const [items, total] = await Promise.all([
    prisma.task.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    }),
    prisma.task.count({ where }),
  ]);

  return res.status(200).json({
    items,
    page,
    pageSize,
    total,
    totalPages: Math.ceil(total / pageSize),
  });
};

export const getTask = async (req: AuthRequest, res: Response) => {
  const task = await prisma.task.findFirst({
    where: { id: req.params.id, userId: req.user!.id },
  });

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  return res.status(200).json(task);
};

export const createTask = async (req: AuthRequest, res: Response) => {
  const parsed = createTaskSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid request", errors: parsed.error.flatten() });
  }

  const task = await prisma.task.create({
    data: {
      ...parsed.data,
      userId: req.user!.id,
    },
  });

  return res.status(201).json(task);
};

export const updateTask = async (req: AuthRequest, res: Response) => {
  const parsed = updateTaskSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid request", errors: parsed.error.flatten() });
  }

  const existing = await prisma.task.findFirst({
    where: { id: req.params.id, userId: req.user!.id },
  });

  if (!existing) {
    return res.status(404).json({ message: "Task not found" });
  }

  const task = await prisma.task.update({
    where: { id: existing.id },
    data: parsed.data,
  });

  return res.status(200).json(task);
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
  const existing = await prisma.task.findFirst({
    where: { id: req.params.id, userId: req.user!.id },
  });

  if (!existing) {
    return res.status(404).json({ message: "Task not found" });
  }

  await prisma.task.delete({ where: { id: existing.id } });
  return res.status(200).json({ message: "Task deleted" });
};

export const toggleTask = async (req: AuthRequest, res: Response) => {
  const existing = await prisma.task.findFirst({
    where: { id: req.params.id, userId: req.user!.id },
  });

  if (!existing) {
    return res.status(404).json({ message: "Task not found" });
  }

  const nextStatus = existing.status === "DONE" ? "PENDING" : "DONE";

  const task = await prisma.task.update({
    where: { id: existing.id },
    data: { status: nextStatus },
  });

  return res.status(200).json(task);
};
