import { Router } from "express";
import { OrderItemOdsyController } from "../controllers/orderItem.odsy.controller";
import { OrderItemOdsyService } from "../services/odsy.orderItem.service";
import { OrderItemOdsyRepository } from "../repositories/orderItem.odsy.repository";

const router = Router();

// зв’язуємо всі шари (dependency injection)
const orderItemRepository = new OrderItemOdsyRepository ();
const orderItemService = new OrderItemOdsyService(orderItemRepository);
const orderItemController = new OrderItemOdsyController(orderItemService);

router.post("/", orderItemController.createOrderItemOdsy);

router.get("/", orderItemController.getAllOrderItemOdsy);

router.get("/:id", orderItemController.getOrderItemOdsyById);

router.patch("/:id", orderItemController.updateOrderItemOdsy);

router.delete("/:id", orderItemController.deleteOrderItemOdsy);

export default router;