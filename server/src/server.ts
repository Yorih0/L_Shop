import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes";
import cookieParser from "cookie-parser";


const app = express();
app.use(cookieParser());
app.use(express.json());

app.use(cors({
    origin: true,
    credentials: true
}));

app.use("/api/users", userRoutes);

app.listen(5000, () => {
  console.log("Server started on http://localhost:5000");
});

