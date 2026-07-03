require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB =
  require("./config/db");

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const stockRoutes = require("./routes/stockRoutes");
const salesExecutiveRoutes = require("./routes/salesExecutiveRoutes");
const dispatchRoutes = require("./routes/dispatchRoutes");
const returnRoutes = require("./routes/returnRoutes");
const reportRoutes = require("./routes/reportRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const profileRoutes = require("./routes/profileRoutes");


const app = express();

app.use(cors());

app.use(express.json());

// To show backend is starting and takes time
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Distribo Backend Running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/stock", stockRoutes);
app.use("/api/salesexecutives",salesExecutiveRoutes);
app.use("/api/dispatch", dispatchRoutes);
app.use("/api/returns", returnRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/profile",profileRoutes);


const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server Running On Port ${PORT}`);
    });
  } catch (error) {
    console.error(error);
  }
};

startServer();