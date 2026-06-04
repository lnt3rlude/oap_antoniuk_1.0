import { Router } from "express";
import { OrderItemOdsyController } from "../controllers/orderItem.odsy.controller";
import { OrderItemOdsyService } from "../services/odsy.orderItem.service";
import { OrderItemOdsyRepository } from "../repositories/orderItem.odsy.repository";
import { ProductOdsyRepository } from "../repositories/product.odsy.repository"; // 1. ДОДАЛИ ІМПОРТ

const router = Router();

const orderItemRepository = new OrderItemOdsyRepository();
const productRepository = new ProductOdsyRepository(); 

const orderItemService = new OrderItemOdsyService(orderItemRepository, productRepository);
const orderItemController = new OrderItemOdsyController(orderItemService);

router.post("/", orderItemController.createOrderItemOdsy);

router.get("/", orderItemController.getAllOrderItemOdsy);

router.get("/:id", orderItemController.getOrderItemOdsyById);

router.put("/:id", orderItemController.updateOrderItemOdsy);

router.delete("/:id", orderItemController.deleteOrderItemOdsy);

export default router;