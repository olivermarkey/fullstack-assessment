import 'dotenv/config';
import express from "express";
import cors from "cors";
import materialRouter from "./routes/material-router";
import nounRouter from "./routes/noun-router";
import classRouter from "./routes/class-router";
import authRouter from "./routes/auth-router";
import morgan from "morgan";
import { authenticateToken } from "./middleware/auth-middleware";

const app = express();
const PORT = process.env.EXPRESS_PORT || 8080;

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173", // Allow react router dev server
      "http://localhost:3000", // Allow react router prod server
      "http://localhost:3001", // Allow postgrest server
    ],
    credentials: true,
  })
);
app.use(morgan("dev"));

// Parse JSON bodies first
app.use(express.json());

// Then parse URL-encoded bodies, but only if content-type matches
app.use(
  express.urlencoded({
    extended: true,
    type: "application/x-www-form-urlencoded",
  })
);

// API Health Check
app.get("/api", (req, res) => {
  res.json({ message: "API is running" });
});

// Apply auth middleware to all routes after this point
app.use("/api", (req, res, next) => {
  authenticateToken(req, res, next);
});

// API Routes
app.use("/api/materials", materialRouter);
app.use("/api/nouns", nounRouter);
app.use("/api/classes", classRouter);
// This is not used, but in future it could be used to authenticate API requests.
app.use("/api/auth", authRouter);

// Error handling middleware
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).json({ message: "Something went wrong!" });
  }
);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
