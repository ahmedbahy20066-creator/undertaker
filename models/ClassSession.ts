import mongoose, { Schema } from "mongoose";

const classSessionSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    trainer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    timeSlot: {
      type: Date,
      required: true,
    },

    capacity: {
      type: Number,
      required: true,
      min: 1,
      validate: {
        validator: Number.isInteger,
        message: "Capacity must be a positive integer",
      },
    },
  },
  { timestamps: true }
);

const ClassSession = mongoose.model("ClassSession", classSessionSchema);

export default ClassSession;