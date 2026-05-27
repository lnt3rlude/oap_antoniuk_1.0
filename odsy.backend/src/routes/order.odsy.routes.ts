import { Router } from "express";
import { OrderOdsyController } from "../controllers/order.odsy.controller";
import { OrderOdsyService } from "../services/odsy.order.service";
import { OrderOdsyRepository } from "../repositories/order.odsy.repository";

const router = Router();

const orderRepository = new OrderOdsyRepository ();
const orderService = new OrderOdsyService(orderRepository);
const orderController = new OrderOdsyController(orderService);

router.post("/", orderController.createOrderOdsy);

router.get("/", orderController.getAllOrderOdsy);

router.get("/:id", orderController.getOrderOdsyById);

router.patch("/:id", orderController.updateOrderOdsy);

router.delete("/:id", orderController.deleteOrderOdsy);

export default router;