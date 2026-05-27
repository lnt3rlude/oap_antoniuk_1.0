import { Request, Response } from "express";
import { OrderItemOdsyService } from "../services/odsy.orderItem.service";
import { CreateOrderItemOdsyDto, UpdateOrderItemOdsyDto } from "../dtos/odsy.orderItem.dto";
import { AppError } from "../errors/AppError";
import { validateCreateOrderItemDto, validateUpdateOrderItemDto } from "../validators/orderItem.validators";

export class OrderItemOdsyController {
    constructor(private readonly orderItemService: OrderItemOdsyService ) {} // Dependency Injections - Передаємо ProductService в Контроллер

    createOrderItemOdsy = async (req: Request, res: Response) => {
    const errors = validateCreateOrderItemDto(req.body);

    if (errors.length) {
        throw new AppError("Invalid request body", 400, "VALIDATION_ERROR", errors);
    }

    const orderItem = await this.orderItemService.createOrderItemOdsy(
        req.body as CreateOrderItemOdsyDto
    );

    return res.status(201).json(orderItem);
    };

    getAllOrderItemOdsy = async (req: Request, res: Response) => {
    const orderItem = await this.orderItemService.getAllOrderItemOdsy();
    return res.status(200).json(orderItem);
    };

    getOrderItemOdsyById = async (req: Request, res: Response) => {
    const id = req.params.id;

    if (!id || Array.isArray(id)) {
        throw new AppError("Invalid id", 400, "INVALID_ID");
    }

    const orderItem = await this.orderItemService.getOrderItemOdsyById(id);
    return res.status(200).json(orderItem);
    };

    updateOrderItemOdsy = async (req: Request, res: Response) => {
    const id = req.params.id;

    if (!id || Array.isArray(id)) {
        throw new AppError("Invalid id", 400, "INVALID_ID");
    }

    const dto = req.body as UpdateOrderItemOdsyDto;
    const errors = validateUpdateOrderItemDto(dto);

    if (errors.length) {
        throw new AppError("Invalid request body", 400, "VALIDATION_ERROR", errors);
    }

    const orderItem = await this.orderItemService.updateOrderItemOdsy(id, dto);

    return res.status(200).json(orderItem);
    };

    deleteOrderItemOdsy = async (req: Request, res: Response) => {
    const id = req.params.id;

    if (!id || Array.isArray(id)) {
        throw new AppError("Invalid id", 400, "INVALID_ID");
    }

    await this.orderItemService.deleteOrderItemOdsy(id);

    return res.sendStatus(204);
    };
}
    
