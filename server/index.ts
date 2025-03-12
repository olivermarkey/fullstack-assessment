import express from "express";
import materialRouter from "./routes/material-router";
import nounRouter from "./routes/noun-router";
import classRouter from "./routes/class-router";

const app = express();
const PORT = process.env.EXPRESS_PORT || 8080;
// Middleware
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

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
