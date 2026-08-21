import { Router } from "express";
import {
  createClassSession,
  getClassSessions,
  getClassSessionById,
  updateClassSession,
  deleteClassSession,
} from "../controllers/classSessionController";

import { authenticate, authorize } from "../middleware/auth.middleware";

const router = Router();

router.post(
  "/",
  authenticate,
  authorize("trainer"),
  createClassSession
);

router.get("/", authenticate, getClassSessions);

router.get("/:id", authenticate, getClassSessionById);

router.put(
  "/:id",
  authenticate,
  authorize("trainer"),
  updateClassSession
);

router.delete(
  "/:id",
  authenticate,
  authorize("trainer"),
  deleteClassSession
);

export default router;