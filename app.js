const express = require("express");
const cors = require("cors");
const productsRouter = require("./app/routes/product.route");

const cartsRouter = require("./app/routes/cart.route")
const ApiError = require("./app/api-error");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/products", productsRouter);

app.use("/api/carts", cartsRouter);
app.get("/", (req, res) => {
    res.json({ message: "Xin chào bạn đến với cửa hàng"});
});
// Xử lý phản hồi lỗi 404
app.use((req, res, next) => {
    return next(new ApiError(404, "Resource not found"));
});

app.use((error, req, res, next) => {
    return res.status(error.statusCode || 500).json({
        message: error.message || "Internal Server Error",
    });
});



module.exports = app;