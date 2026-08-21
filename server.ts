import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import dns from "dns";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger";
import classSessionRoutes from "./routes/classSession.routes";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes";
import bookingRoutes from "./routes/booking.router";
dns.setServers(["8.8.8.8", "8.8.4.4"]);

dotenv.config();

const app = express();
app.use(cookieParser());
app.use(express.json());

app.use("/class-sessions", classSessionRoutes);

app.use("/auth", authRoutes);

app.use("/bookings", bookingRoutes);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to Undertaker API",
    docs: "/api-docs"
  });
});

const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGO_URL!)
  .then(() => {
    console.log("MongoDB connected");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error);
  });