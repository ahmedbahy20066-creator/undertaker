import { Router } from "express";
import { createBooking, cancelBooking, getMyBookings } from "../controllers/booking.controller";
import { authenticate, authorize } from "../middleware/auth.middleware";

const router = Router();
/**
 * @swagger
 * /bookings:
 *   post:
 *     summary: Create a new booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sessionId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Booking created successfully
 *       400:
 *         description: Session full or already booked
 */
router.post("/", authenticate, authorize("member"), createBooking);
/**
 * @swagger
 * /bookings/{id}/cancel:
 *   put:
 *     summary: Cancel an existing booking
 *     tags: [Bookings]
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
 *         description: Booking cancelled successfully
 *       403:
 *         description: Not your booking
 *       404:
 *         description: Booking not found
 */
router.put("/:id/cancel", authenticate, authorize("member"), cancelBooking);
/**
 * @swagger
 * /bookings/my-bookings:
 *   get:
 *     summary: Get all bookings for the logged-in member
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of bookings
 */
router.get("/my-bookings", authenticate, authorize("member"), getMyBookings);

export default router;