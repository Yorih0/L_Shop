import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes";
import cookieParser from "cookie-parser";
import path from "node:path";


const app = express();
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "L_Shop API",
      version: "1.0.0",
    },
  },
  apis: [
    path.join(__dirname, "/routes/*.js"),
    path.join(__dirname, "/routes/*.ts"),
  ],
};

const specs = swaggerJsdoc(options);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use(cookieParser());
app.use(express.json());

app.use(cors({
    origin: true,
    credentials: true
}));
app.use("/api/users", userRoutes);

import productRoutes from "./routes/productRoutes"
app.use("/api/products",productRoutes)

import basketRoutes from "./routes/basketRoutes"
app.use("/api/basket", basketRoutes);

app.listen(5000, () => {
  console.log("Server started on http://localhost:5000");
});

