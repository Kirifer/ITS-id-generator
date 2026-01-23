require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const cookieParser = require("cookie-parser");
const { getPresignedUrl } = require("./config/s3");
const authRoutes = require("./routes/authRoutes");
const idCardsRouter = require("./routes/idCardRoutes");
const idGeneratorRoutes = require("./routes/idGeneratorRoutes");
const filterRoutes = require("./routes/filterRoutes");
const { dashboardRoutes } = require("./routes/dashboardRoutes");
const { adminRoutes } = require("./routes/adminRoutes");
const hrRoutes = require("./routes/hrRoutes");
const { positionRoutes } = require("./routes/positionRoutes");
const downloadRoutes = require("./routes/downloadRoutes")

if (
  !process.env.MONGO_URI ||
  !process.env.FRONTEND_URL ||
  !process.env.JWT_ACCESS_SECRET ||
  !process.env.JWT_REFRESH_SECRET ||
  !process.env.AWS_ACCESS_KEY_ID ||
  !process.env.AWS_SECRET_ACCESS_KEY ||
  !process.env.AWS_REGION ||
  !process.env.AWS_BUCKET_NAME
) {
  console.error(
    "❌ Missing required environment variables. Check .env file."
  );
  process.exit(1);
}

const app = express();


const corsOptions = {
  origin: [
    process.env.FRONTEND_URL,
    "http://localhost:3000",
    "http://localhost:5000",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(cookieParser());


app.use(express.json({ limit: "10mb", strict: false }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));


const primaryUploads = path.join(__dirname, "uploads");
console.log("[static] /uploads →", primaryUploads);
app.use("/uploads", express.static(primaryUploads));


app.use("/api/auth", authRoutes);
app.use("/api/id-cards", idCardsRouter);
app.use("/api/id-generator", idGeneratorRoutes);
app.use("/api/filter", filterRoutes);
app.use("/api/stats", dashboardRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/hr", hrRoutes);
app.use("/api/position", positionRoutes);
app.use("/api/images", downloadRoutes);

app.get("/api/images/url", async (req, res) => {
  try {
    const { key } = req.query;

    if (!key) {
      return res.status(400).json({ error: "S3 key is required" });
    }

    const presignedUrl = getPresignedUrl(key);
    
    res.json({ url: presignedUrl });
  } catch (error) {
    console.error("Failed to generate pre-signed URL:", error);
    res.status(500).json({ error: "Failed to generate image URL" });
  }
});



app.use((req, res) => {
  console.log("404 - Route Not Found:", req.method, req.url);
  res.status(404).json({
    error: "Route Not Found",
    method: req.method,
    path: req.url,
  });
});

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    error: "Internal server error",
    message: err.message,
  });
});


const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    console.log("🪣 AWS Bucket:", process.env.AWS_BUCKET_NAME);
    console.log("🌏 AWS Region:", process.env.AWS_REGION);

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  });
