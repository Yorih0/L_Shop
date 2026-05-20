import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger';

// Импорт роутов
import userRoutes from "./routes/userRoutes";
import productRoutes from "./routes/productRoutes";
import basketRoutes from "./routes/basketRoutes";
import ReviewRoutes from "./routes/reviewRoutes";

const app = express();

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(cors({
    origin: true,
    credentials: true
}));

// ✅ Swagger UI - ДОБАВЛЯЕМ ДО РОУТОВ
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Роуты API
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/basket", basketRoutes);
app.use("/api/reviews", ReviewRoutes);

// Запуск сервера
app.listen(5000, () => {
  console.log("🚀 Server started on http://localhost:5000");
  console.log("📚 Swagger UI available on http://localhost:5000/api-docs");
});