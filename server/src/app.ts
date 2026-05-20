import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes";
import cookieParser from "cookie-parser";
import productRoutes from "./routes/productRoutes";
import basketRoutes from "./routes/basketRoutes";

const app = express();
app.use(cookieParser());
app.use(express.json());

app.use(cors({
    origin: true,
    credentials: true
}));

app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/basket", basketRoutes);

export default app;

