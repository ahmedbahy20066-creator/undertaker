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
/**
 * @swagger
 * /class-sessions:
 *   post:
 *     summary: Create a new class session
 *     tags: [Class Sessions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - timeSlot
 *               - capacity
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Boxing Class"
 *               timeSlot:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-08-23T10:00:00.000Z"
 *               capacity:
 *                 type: number
 *                 example: 20
 *     responses:
 *       201:
 *         description: Class session created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Trainer access required
 */
router.post(
  "/",
  authenticate,
  authorize("trainer"),
  createClassSession
);
/**
 * @swagger
 * /class-sessions:
 *   get:
 *     summary: Get all class sessions
 *     tags: [Class Sessions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of class sessions
 *       401:
 *         description: Unauthorized
 */
router.get("/", authenticate, getClassSessions);

/**
 * @swagger
 * /class-sessions/{id}:
 *   get:
 *     summary: Get a class session by ID
 *     tags: [Class Sessions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Class session details
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Class session not found
 */
router.get("/:id", authenticate, getClassSessionById);

/**
 * @swagger
 * /class-sessions/{id}:
 *   put:
 *     summary: Update a class session
 *     tags: [Class Sessions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Evening Fitness"
 *               timeSlot:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-08-22T18:00:00.000Z"
 *               capacity:
 *                 type: number
 *                 example: 25
 *     responses:
 *       200:
 *         description: Class session updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Trainer access required
 *       404:
 *         description: Class session not found
 */
router.put(
  "/:id",
  authenticate,
  authorize("trainer"),
  updateClassSession
);
/**
 * @swagger
 * /class-sessions/{id}:
 *   delete:
 *     summary: Delete a class session
 *     tags: [Class Sessions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Class session deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Trainer access required
 *       404:
 *         description: Class session not found
 */
router.delete(
  "/:id",
  authenticate,
  authorize("trainer"),
  deleteClassSession
);

export default router;