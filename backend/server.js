import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import seedRouter from "./routes/seedRoutes.js";
import productRouter from "./routes/productRoutes.js";
import userRouter from "./routes/userRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import payRouter from "./routes/payRouter.js";
import path from "path";
import cors from 'cors'



dotenv.config();

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("connected to db"))
  .catch((err) => console.log(err.message));

const app = express();

// Enable CORS
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/api/rzp/razorpay-key", (req, res) => {
  const razorpayKey = process.env.REACT_APP_RAZORPAY_KEY_ID;
  res.json({ razorpayKey });
});

app.use("/api/seed", seedRouter);
app.use("/api/products", productRouter);
app.use("/api/users", userRouter);
app.use("/api/orders", orderRouter);
app.use("/api/create", payRouter);
// app.use("/api/rzp", rzpRouter);

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "/frontend/build")));
app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "/frontend/build/index.html"))
);

app.use((err, req, res, next) => {
  //for express Async Handler
  res.status(500).send({ message: err.message });
});

const port = process.env.PORT || 5000;

app.listen(port, "0.0.0.0", () => {
  console.log(`server is listening at : ${port}`);
});

