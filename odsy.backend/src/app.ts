import cors from "cors"; // CORS Спосіб з'єднування фронтенду та бекенду 
import express from "express"; 
import helmet from "helmet"; 
import userRoutes from "./routes/user.odsy.routes";
import productRoutes from "./routes/product.odsy.routes";
import orderRoutes from "./routes/order.odsy.routes";
import categoryRoutes from "./routes/category.odsy.routes";
import orderItemRoutes from "./routes/orderItem.odsy.routes";
import authRoutes from "./routes/auth.routes"; 
import { loggingMiddleware } from "./middleware/logging.middleware";
import { globalErrorHandler } from "./middleware/errorhandler";

const app = express(); // Запускаємо прогу

// Автоматично виставляє 15+ захисних заголовків (X-Frame-Options, X-Content-Type-Options тощо)
app.use(helmet({
  contentSecurityPolicy: false, 
}));

// Залізобетонно видаляємо заголовок "X-Powered-By: Express", щоб приховати технологічний стек
app.disable('x-powered-by');

// Налаштовуємо Cors
app.use(
  cors({
    origin: "http://localhost:5173", // Дозволяємо запити саме з твого фронтенду
    credentials: true,               // Дозволяє передавати JWT-токени в заголовках
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Дозволені методи
    allowedHeaders: ["Content-Type", "Authorization"], // Дозволені заголовки
  })
);

app.use(express.json()); // Джейсон вчимось читати
app.use(loggingMiddleware); // 

// HEALTH CHECK
app.get("/health", (req, res) => {
  res.status(200).json({ ok: true, timestamp: new Date() });
});

// ROUTES (Усі ендпоінти приведені до стандарту /api/v1)
app.use("/api/v1/auth", authRoutes); 
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/order-items", orderItemRoutes);

// ERROR HANDLER (Завжди залишається останнім)
app.use(globalErrorHandler);

export default app;
