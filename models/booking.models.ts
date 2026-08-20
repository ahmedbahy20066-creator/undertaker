   import mongoose, { Schema } from "mongoose";

const bookingSchema = new Schema(
  {
    session: {
      type: Schema.Types.ObjectId,
      ref: "ClassSession",
      required: true,
    },
    member: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;