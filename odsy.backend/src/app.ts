import cors from "cors";
import express from "express";
import userRoutes from "./routes/user.odsy.routes";
import productRoutes from "./routes/product.odsy.routes";
import orderRoutes from "./routes/order.odsy.routes";
import categoryRoutes from "./routes/category.odsy.routes";
import orderItemRoutes from "./routes/orderItem.odsy.routes";

import { loggingMiddleware } from "./middleware/logging.middleware";
import { globalErrorHandler } from "./middleware/errorhandler";

const app = express();

app.use(cors());
app.use(express.json());
app.use(loggingMiddleware);

// HEALTH
app.get("/health", (req, res) => {
  res.status(200).json({ ok: true, timestamp: new Date() });
});

// ROUTES (Тепер з префіксом /v1)
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/order-items", orderItemRoutes);

// ERROR HANDLER (має бути останнім)
app.use(globalErrorHandler);

export default app;