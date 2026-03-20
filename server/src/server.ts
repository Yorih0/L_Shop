import express from "express";
import cors from "cors";
import productRoutes from "./routes/productRoutes"

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/products",productRoutes)
app.listen(5000, () => {
  console.log("Server started on http://localhost:5000");
});

