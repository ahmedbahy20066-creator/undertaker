import { Request, Response } from "express";
import ClassSession from "../models/ClassSession";
import Booking from "../models/booking.models";
export const createClassSession = async (req: Request, res: Response) => {
  try {
    const { title, timeSlot, capacity } = req.body;

    if (!title || !timeSlot || capacity === undefined) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const sessionDate = new Date(timeSlot);

    if (isNaN(sessionDate.getTime())) {
      return res.status(400).json({
        message: "Invalid timeSlot",
      });
    }

    if (sessionDate <= new Date()) {
      return res.status(400).json({
        message: "Session must be in the future",
      });
    }

    if (!Number.isInteger(capacity) || capacity <= 0) {
      return res.status(400).json({
        message: "Capacity must be a positive integer",
      });
    }

    const session = await ClassSession.create({
      title,
      trainer: (req as any).user.id,
      timeSlot: sessionDate,
      capacity,
    });

    return res.status(201).json(session);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to create class session",
    });
  }
};

export const getClassSessions = async (req: Request, res: Response) => {
  try {
    const { title, trainer, timeSlot, available } = req.query;

    const filter: any = {};

    if (title) {
      filter.title = {
        $regex: title,
        $options: "i",
      };
    }

    if (trainer) {
      filter.trainer = trainer;
    }

    if (timeSlot) {
      const date = new Date(timeSlot as string);

      if (isNaN(date.getTime())) {
        return res.status(400).json({
          message: "Invalid timeSlot",
        });
      }

      filter.timeSlot = date;
    }

    const sessions = await ClassSession.find(filter)
      .populate("trainer", "fullName email")
      .sort({ timeSlot: 1 });

    if (available === "true") {
      const availableSessions = [];

      for (const session of sessions) {
        const bookedCount = await Booking.countDocuments({
          session: session._id,
          isActive: true,
        });

        if (bookedCount < session.capacity) {
          availableSessions.push(session);
        }
      }

      return res.status(200).json(availableSessions);
    }

    return res.status(200).json(sessions);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to get class sessions",
    });
  }
};
export const getClassSessionById = async (req: Request, res: Response) => {
  try {
    const session = await ClassSession.findById(req.params.id)
      .populate("trainer", "fullName email");

    if (!session) {
      return res.status(404).json({
        message: "Class session not found",
      });
    }

    return res.status(200).json(session);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to get class session",
    });
  }
};
export const updateClassSession = async (req: Request, res: Response) => {
  try {
    const { title, timeSlot, capacity } = req.body;

    const session = await ClassSession.findById(req.params.id);

    if (!session) {
      return res.status(404).json({
        message: "Class session not found",
      });
    }

    if (session.trainer.toString() !== (req as any).user.id) {
      return res.status(403).json({
        message: "You can only update your own class sessions",
      });
    }

    if (timeSlot !== undefined) {
      const sessionDate = new Date(timeSlot);

      if (isNaN(sessionDate.getTime())) {
        return res.status(400).json({
          message: "Invalid timeSlot",
        });
      }

      if (sessionDate <= new Date()) {
        return res.status(400).json({
          message: "Session must be in the future",
        });
      }

      session.timeSlot = sessionDate;
    }

    if (title !== undefined) {
      if (!title.trim()) {
        return res.status(400).json({
          message: "Title is required",
        });
      }

      session.title = title;
    }

    if (capacity !== undefined) {
      if (!Number.isInteger(capacity) || capacity <= 0) {
        return res.status(400).json({
          message: "Capacity must be a positive integer",
        });
      }

      session.capacity = capacity;
    }

    await session.save();

    return res.status(200).json(session);
  } catch (error) {
  console.error("UPDATE ERROR:", error);

  return res.status(500).json({
    message: "Failed to update class session",
    error: error instanceof Error ? error.message : error,
  });
}
};
export const deleteClassSession = async (req: Request, res: Response) => {
  try {
    const session = await ClassSession.findById(req.params.id);

    if (!session) {
      return res.status(404).json({
        message: "Class session not found",
      });
    }

    if (session.trainer.toString() !== (req as any).user.id) {
      return res.status(403).json({
        message: "You can only delete your own class sessions",
      });
    }

    const activeBookings = await Booking.countDocuments({
      session: session._id,
      isActive: true,
    });

    if (activeBookings > 0) {
      return res.status(400).json({
        message: "Cannot delete a session with confirmed bookings",
      });
    }

    await ClassSession.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      message: "Class session deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to delete class session",
    });
  }
};