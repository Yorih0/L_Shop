import express from "express";
import cors from "cors";
import productRoutes from "./routes/productRoutes"
import userRoutes from "./routes/userRoutes";
import cookieParser from "cookie-parser";
import basketRoutes from "./routes/basketRoutes"


const app = express();
app.use(cookieParser());
app.use(express.json());

app.use(cors({
    origin: true,
    credentials: true
}));

app.use("/api/products",productRoutes)
app.use("/api/users", userRoutes);
app.use("/api/basket", basketRoutes);

app.listen(5000, () => {
  console.log("Server started on http://localhost:5000");
});

