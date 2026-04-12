import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import userRoutes from "./routes/userRoutes";
import productRoutes from "./routes/productRoutes";
import basketRoutes from "./routes/basketRoutes";
import reviewRoutes from "./routes/reviewRoutes";

const app = express();

app.use(cookieParser());
app.use(express.json());

app.use(cors({
  origin: true,
  credentials: true
}));

// routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/basket", basketRoutes);
app.use("/api/reviews", reviewRoutes);

export default app; 