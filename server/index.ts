import express from "express";  
import materialRouter from "./routes/material";
const app = express();

app.get("/api", (req, res) => {
  res.json({ message: "Hello, world!" });
});

app.use("/api/materials", materialRouter);



app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

