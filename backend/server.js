const express = require("express");
const cors = require("cors");
const errorHandler = require("./middleware/errorHandler");
const connectDb = require("./config/dbConnection");
const dotenv = require("dotenv").config();

let dbConnected = false;

// Connect to database
connectDb().then((connected) => {
    dbConnected = connected;
}).catch((err) => {
    console.log("Failed to connect to database:", err);
    dbConnected = false;
});

const app = express();

const port = process.env.PORT || 10000;

// CORS configuration
app.use(cors({
    origin: [
        "http://localhost:5173", 
        "http://127.0.0.1:5173",
        "http://192.168.11.213:5173",
        "https://my-contact-cyan.vercel.app"
    ],
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
}));

app.use(express.json());

// Request logging middleware
app.use("/", (req, res, next) => {
    console.log(`Request Method: ${req.method}, Request URL: ${req.url}`);
    next();
});

// Root route for basic API info
app.get("/", (req, res) => {
  res.status(200).json({
    message: "MyContacts Backend API",
    version: "1.0.0",
    status: "running",
    endpoints: {
      health: "/health",
      ping: "/ping",
      contacts: "/api/contacts",
      users: "/api/users"
    },
    timestamp: new Date().toISOString()
  });
});

// Health check route
app.get("/health", (req, res) => {
  try {
    res.status(200).json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || "development",
      database: dbConnected ? "connected" : "disconnected"
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Simple health check for monitoring services
app.get("/ping", (req, res) => {
  res.status(200).send("OK");
});

// API routes
app.use("/api/contacts", require("./routes/contactRoutes"));
app.use("/api/users", require("./routes/userRoutes"));

app.use(errorHandler);

app.listen(port, "0.0.0.0", () => {
    console.log(`server running on port ${port}`);
    console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
    console.log(`Database connected: ${process.env.CONNECTION_STRING ? "Yes" : "No"}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.log(`Error: ${err.message}`);
    process.exit(1);
});