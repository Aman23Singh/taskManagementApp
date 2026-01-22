import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  createTask,
  deleteTask,
  getTask,
  listTasks,
  toggleTask,
  updateTask,
} from "../controllers/taskController.js";

const router = Router();

router.use(requireAuth);

router.get("/", listTasks);
router.post("/", createTask);
router.get("/:id", getTask);
router.patch("/:id", updateTask);
router.delete("/:id", deleteTask);
router.post("/:id/toggle", toggleTask);

export default router;
