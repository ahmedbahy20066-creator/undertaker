import { Router } from "express";
import { createBooking, cancelBooking, getMyBookings } from "../controllers/booking.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";

const router = Router();

router.post("/", authenticate, authorize("member"), createBooking);
router.put("/:id/cancel", authenticate, authorize("member"), cancelBooking);
router.get("/my-bookings", authenticate, authorize("member"), getMyBookings);

export default router;