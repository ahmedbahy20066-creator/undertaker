import { Request, Response } from "express";
import Booking from "../models/booking.models";
import ClassSession from "../models/ClassSession";
export async function createBooking(req: Request, res: Response) {
  try {
    const memberId = (req as any).user.id;
    const sessionId = req.body.sessionId;

    const session = await ClassSession.findById(sessionId);
    if (!session) {
      res.status(404).json({ message: "Session not found" });
      return;
    }

    const activeBookingsCount = await Booking.countDocuments({
      session: sessionId,
      isActive: true,
    });

    if (activeBookingsCount >= session.capacity) {
      res.status(400).json({ message: "Session is fully booked" });
      return;
    }

    const matchingBookings = await Booking.find({
      session: sessionId,
      member: memberId,
      isActive: true,
    });

    if (matchingBookings.length > 0) {
      res.status(400).json({ message: "You already booked this session" });
      return;
    }

    const newBooking = await Booking.create({
      session: sessionId,
      member: memberId,
      isActive: true,
    });

    res.status(201).json(newBooking);
  } catch (error) {
    res.status(500).json({ message:  "Please try again later!", error: error });
  }
}

export async function cancelBooking(req: Request, res: Response) {
  try {
    const memberId = (req as any).user.id;
    const bookingId = req.params.id;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      res.status(404).json({ message: "Booking not found" });
      return;
    }

    if (booking.member.toString() !== memberId) {
      res.status(403).json({ message: "You can only cancel your own booking" });
      return;
    }

    booking.isActive = false;
    await booking.save();

    res.status(200).json({ message: "Booking cancelled successfully" });
  } catch (error) {
    res.status(500).json({ message:  "Please try again later!", error: error });
  }
}

export async function getMyBookings(req: Request, res: Response) {
  try {
    const memberId = (req as any).user.id;

    const bookings = await Booking.find({ member: memberId }).populate("session");

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message:  "Please try again later!", error: error });
  }
}