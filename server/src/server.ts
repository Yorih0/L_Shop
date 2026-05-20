import app from './app';

const PORT = process.env.PORT || 5000;

<<<<<<< HEAD
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
=======
const app = express();
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

import ReviewRoutes from "./routes/reviewRoutes"
app.use("/api/reviews",ReviewRoutes)

app.listen(5000, () => {
  console.log("Server started on http://localhost:5000");
>>>>>>> d1acdafe674c8e41e7668b5e7bf4a67659ce1576
});
