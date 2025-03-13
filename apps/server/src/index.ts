import express from "express";
import cors from "cors";
import materialRouter from "./routes/material-router";
import nounRouter from "./routes/noun-router";
import classRouter from "./routes/class-router";

// React Router Serve Dependencies
import path from "path";
import url from "node:url";
import type { ServerBuild } from "react-router";
import morgan from "morgan";
import { createRequestHandler } from "@react-router/express";
import sourceMapSupport from "source-map-support";
import fs from "fs";
import os from "node:os";

const app = express();
const PORT = process.env.EXPRESS_PORT || 8080;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173'], // Allow your Vite dev server
  credentials: true
}));
app.use(morgan('dev'));
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

// react-router-serve
/* sourceMapSupport.install({
  retrieveSourceMap: function (source) {
    let match = source.startsWith("file://");
    if (match) {
      let filePath = url.fileURLToPath(source);
      let sourceMapPath = `${filePath}.map`;
      if (fs.existsSync(sourceMapPath)) {
        return {
          url: source,
          map: fs.readFileSync(sourceMapPath, "utf8"),
        };
      }
    }
    return null;
  },
});

async function serveBuild() {
  // Change path to look in the same directory as the server
  const buildPath = path.resolve(
    process.cwd(),
    "./frontend/build/server/index.js"
  );
  console.log("[serveBuild] buildPath:", buildPath);

  // Check if file exists before trying to import it
  if (!fs.existsSync(buildPath)) {
    throw new Error(
      `Build file not found at: ${buildPath}. Have you run 'npm run build' in the frontend directory?`
    );
  }

  let build: ServerBuild = await import(url.pathToFileURL(buildPath).href);

  //app.use(compression()); // What does this do?
  app.use(
    path.posix.join(build.publicPath, "assets"),
    express.static(path.join(build.assetsBuildDirectory, "assets"), {
      immutable: true,
      maxAge: "1y",
    })
  );
  app.use(build.publicPath, express.static(build.assetsBuildDirectory));
  app.use(express.static("public", { maxAge: "1h" }));
  app.use(morgan("tiny"));

  app.all(
    "*",
    createRequestHandler({
      build,
      mode: "production" // process.env.NODE_ENV, //This should be an environment variable
    })
  );
} */

// Start server with React Router serve
/* async function startServer() {
  try {
    await serveBuild();

    let onListen = () => {
      let address =
        process.env.HOST ||
        Object.values(os.networkInterfaces())
          .flat()
          .find((ip) => String(ip?.family).includes("4") && !ip?.internal)
          ?.address;

      if (!address) {
        console.log(`[react-router-serve] http://localhost:${PORT}`);
      } else {
        console.log(
          `[react-router-serve] http://localhost:${PORT} (http://${address}:${PORT})`
        );
      }
    };

    app.listen(PORT, onListen);
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
} */

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
