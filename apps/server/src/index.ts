import express from "express";
import cors from "cors";
import materialRouter from "./routes/material-router";
import nounRouter from "./routes/noun-router";
import classRouter from "./routes/class-router";
import morgan from "morgan";

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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Health Check
app.get("/api", (req, res) => {
  res.json({ message: "API is running" });
});

// API Routes
app.use("/api/materials", materialRouter);
app.use("/api/nouns", nounRouter);
app.use("/api/classes", classRouter);

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
