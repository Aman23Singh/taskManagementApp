"use client";

import React, { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { Task, TaskFilters } from "@/types";
import { taskApi } from "@/lib/tasks";
import TaskList from "@/components/TaskList";
import TaskForm from "@/components/TaskForm";
import TaskFiltersComponent from "@/components/TaskFilters";
import Pagination from "@/components/Pagination";
import Modal from "@/components/Modal";

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<TaskFilters>({
    page: 1,
    pageSize: 10,
    status: "",
    q: "",
  });
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await taskApi.list(filters);
      setTasks(response.items);
      setTotalPages(response.totalPages);
      setTotal(response.total);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to fetch tasks");
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleCreateTask = async (data: { title: string; description?: string; status?: "PENDING" | "IN_PROGRESS" | "DONE" }) => {
    try {
      await taskApi.create(data);
      toast.success("Task created successfully!");
      setIsCreateModalOpen(false);
      fetchTasks();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create task");
    }
  };

  const handleUpdateTask = async (data: { title?: string; description?: string; status?: "PENDING" | "IN_PROGRESS" | "DONE" }) => {
    if (!selectedTask) return;
    try {
      await taskApi.update(selectedTask.id, data);
      toast.success("Task updated successfully!");
      setIsEditModalOpen(false);
      setSelectedTask(null);
      fetchTasks();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update task");
    }
  };

  const handleDeleteTask = async () => {
    if (!selectedTask) return;
    try {
      await taskApi.delete(selectedTask.id);
      toast.success("Task deleted successfully!");
      setIsDeleteModalOpen(false);
      setSelectedTask(null);
      fetchTasks();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete task");
    }
  };

  const handleToggleTask = async (task: Task) => {
    try {
      await taskApi.toggle(task.id);
      toast.success(`Task marked as ${task.status === "DONE" ? "pending" : "done"}!`);
      fetchTasks();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to toggle task");
    }
  };

  const openEditModal = (task: Task) => {
    setSelectedTask(task);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (task: Task) => {
    setSelectedTask(task);
    setIsDeleteModalOpen(true);
  };

  const handleFilterChange = useCallback((newFilters: Partial<TaskFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  }, []);

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Tasks</h2>
          <p className="text-sm text-gray-600 mt-1">
            {total} task{total !== 1 ? "s" : ""} total
          </p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          <svg
            className="mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add Task
        </button>
      </div>

      <TaskFiltersComponent
        filters={filters}
        onFilterChange={handleFilterChange}
      />

      <TaskList
        tasks={tasks}
        isLoading={isLoading}
        onEdit={openEditModal}
        onDelete={openDeleteModal}
        onToggle={handleToggleTask}
      />

      {totalPages > 1 && (
        <Pagination
          currentPage={filters.page || 1}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Task"
      >
        <TaskForm
          onSubmit={handleCreateTask}
          onCancel={() => setIsCreateModalOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedTask(null);
        }}
        title="Edit Task"
      >
        <TaskForm
          task={selectedTask || undefined}
          onSubmit={handleUpdateTask}
          onCancel={() => {
            setIsEditModalOpen(false);
            setSelectedTask(null);
          }}
        />
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedTask(null);
        }}
        title="Delete Task"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete &quot;{selectedTask?.title}&quot;? This action cannot
            be undone.
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => {
                setIsDeleteModalOpen(false);
                setSelectedTask(null);
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteTask}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
