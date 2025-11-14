import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import issueRoutes from "./routes/issueRoutes.js";
import contributionRoutes from "./routes/contributionRoutes.js";
import verifyTokenFactory from "./middleware/verifyToken.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.get("/", (req, res) => res.send("CleanUp Tracker API is live"));

// create middleware instance with service account JSON
const verifyToken = verifyTokenFactory(process.env.FIREBASE_SERVICE_ACCOUNT);

// PUBLIC routes
app.use("/api/issues", issueRoutes);            // some endpoints inside are public
app.use("/api/contributions", contributionRoutes);

// PROTECTED endpoints — apply verifyToken to routes that must be private
// Option 1: protect specific routes; Option 2: duplicate route files for protected vs public
// Example: protect the following subroutes
app.post("/api/issues", verifyToken, async (req, res, next) => next()); // routed inside issues file
app.put("/api/issues/:id", verifyToken, async (req, res, next) => next());
app.delete("/api/issues/:id", verifyToken, async (req, res, next) => next());
app.get("/api/issues/user/:email", verifyToken, async (req, res, next) => next());

app.post("/api/contributions", verifyToken, async (req, res, next) => next());
app.get("/api/contributions/user/:email", verifyToken, async (req, res, next) => next());
app.get("/api/contributions/report/:id", verifyToken, async (req, res, next) => next());

// Note: the above dummy middleware calls just demonstrate pattern; when deploying, 
// either apply verifyToken inside route files or mount different routers for protected routes.
// For clarity: you can remove those lines and instead wrap desired routes in their route files.

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
