import { Router } from "express";
import { OrderOdsyController } from "../controllers/order.odsy.controller";
import { OrderOdsyService } from "../services/odsy.order.service";
import { OrderOdsyRepository } from "../repositories/order.odsy.repository";
import { requireAuth } from "../middleware/auth.middleware"; // 🔐 1. Імпортуємо мідлвару захисту

const router = Router();

const orderRepository = new OrderOdsyRepository();
const orderService = new OrderOdsyService(orderRepository);
const orderController = new OrderOdsyController(orderService);

// Додаємо requireAuth другим параметром. 
// Тепер Express спочатку перевірить JWT, і тільки якщо він валідний — пустить у контролер.

router.post("/", requireAuth, orderController.createOrderOdsy);

router.get("/", requireAuth, orderController.getAllOrderOdsy);

router.get("/:id", requireAuth, orderController.getOrderOdsyById);

router.put("/:id", requireAuth, orderController.updateOrderOdsy);

router.delete("/:id", requireAuth, orderController.deleteOrderOdsy);

export default router;
