const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
require("dotenv").config({ path: path.resolve(process.cwd(), ".env.local") });
const connectDB = require("./config/db");

const resumeRoutes = require("./routes/resume");
const aiRoutes = require("./routes/ai");

const app = express();

connectDB();

const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",")
  : ["http://localhost:3000"];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(morgan("dev"));

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/resume", resumeRoutes);
app.use("/ai", aiRoutes);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`API server running on port ${port}`);
});


