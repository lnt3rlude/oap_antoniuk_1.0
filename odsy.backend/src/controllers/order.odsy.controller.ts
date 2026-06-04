import { Request, Response } from "express";
import { OrderOdsyService } from "../services/odsy.order.service";
import { CreateOrderOdsyDto, UpdateOrderOdsyDto } from "../dtos/odsy.order.dto";
import { AppError } from "../errors/AppError";
import { validateCreateOrderDto, validateUpdateOrderDto } from "../validators/order.validators";

export class OrderOdsyController {
    // ==========================================================
    // ТУМБЛЕР ДЛЯ ЛАБОРАТОРНОЇ РОБОТИ (Змінюй вручну тут):
    // false — система вразлива до IDOR (демонстрація атаки навіть з JWT!)
    // true  — система повністю захищена
    private readonly IS_SECURE = false; 
    // ==========================================================

    constructor(private readonly orderService: OrderOdsyService ) {}

    createOrderOdsy = async (req: Request, res: Response) => {
        const dto = req.body as CreateOrderOdsyDto;
        const errors = validateCreateOrderDto(dto);

        if (errors.length) {
            throw new AppError("Invalid request body", 400, "VALIDATION_ERROR", errors);
        }

        const order = await this.orderService.createOrderOdsy(dto);
        return res.status(201).json(order);
    };
    
    getAllOrderOdsy = async (req: Request, res: Response) => {
        const order = await this.orderService.getAllOrderOdsy();
        return res.status(200).json(order);
    };

    // 1. ОПЕРАЦІЯ READ (Отримання конкретного замовлення)
    getOrderOdsyById = async (req: Request, res: Response) => {
        const id = req.params.id;

        if (!id || Array.isArray(id)) {
            throw new AppError("Invalid id", 400, "INVALID_ID");
        }

        // Читаємо реальний ID користувача, який наша мідлвара дістала з JWT токена
        const currentUserId = (req as any).user?.id;
        if (!currentUserId) {
            throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
        }

        const order = await this.orderService.getOrderOdsyById(id);
        if (!order) {
            throw new AppError("Order not found", 404, "ORDER_NOT_FOUND");
        }

        // Перевірка на IDOR через тумблер
        if (this.IS_SECURE) {
            if (order.userId !== currentUserId) {
                throw new AppError("Access denied: You cannot view other users' orders", 403, "ACCESS_DENIED");
            }
        }

        return res.status(200).json(order);
    };

    // 2. ОПЕРАЦІЯ UPDATE (Зміна замовлення)
    updateOrderOdsy = async (req: Request, res: Response) => {
        const id = req.params.id;

        if (!id || Array.isArray(id)) {
            throw new AppError("Invalid id", 400, "INVALID_ID");
        }

        // Беремо ID з токена
        const currentUserId = (req as any).user?.id;
        if (!currentUserId) {
            throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
        }

        const dto = req.body as UpdateOrderOdsyDto;
        const errors = validateUpdateOrderDto(dto);

        if (errors.length) {
            throw new AppError("Invalid request body", 400, "VALIDATION_ERROR", errors);
        }

        // Спочатку дістаємо замовлення, щоб перевірити власника
        const existingOrder = await this.orderService.getOrderOdsyById(id);
        if (!existingOrder) {
            throw new AppError("Order not found", 404, "ORDER_NOT_FOUND");
        }

        // Перевірка на IDOR перед оновленням
        if (this.IS_SECURE) {
            if (existingOrder.userId !== currentUserId) {
                throw new AppError("Access denied: You cannot modify other users' orders", 403, "ACCESS_DENIED");
            }
        }

        const order = await this.orderService.updateOrderOdsy(id, dto);
        return res.status(200).json(order);
    };

    // 3. ОПЕРАЦІЯ DELETE (Видалення замовлення)
    deleteOrderOdsy = async (req: Request, res: Response) => {
        const id = req.params.id;

        if (!id || Array.isArray(id)) {
            throw new AppError("Invalid id", 400, "INVALID_ID");
        }

        // Беремо ID з токена
        const currentUserId = (req as any).user?.id;
        if (!currentUserId) {
            throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
        }

        // Дістаємо замовлення для перевірки власника
        const existingOrder = await this.orderService.getOrderOdsyById(id);
        if (!existingOrder) {
            throw new AppError("Order not found", 404, "ORDER_NOT_FOUND");
        }

        // Перевірка на IDOR перед видаленням
        if (this.IS_SECURE) {
            if (existingOrder.userId !== currentUserId) {
                throw new AppError("Access denied: You cannot delete other users' orders", 403, "ACCESS_DENIED");
            }
        }

        await this.orderService.deleteOrderOdsy(id);
        return res.sendStatus(204);
    };
}
