import { Request, Response } from "express";
import { OrderOdsyService } from "../services/odsy.order.service";
import { CreateOrderOdsyDto, UpdateOrderOdsyDto } from "../dtos/odsy.order.dto";
import { AppError } from "../errors/AppError";
import { validateCreateOrderDto, validateUpdateOrderDto } from "../validators/order.validators";

export class OrderOdsyController {
    constructor(private readonly orderService: OrderOdsyService ) {} // Dependency Injections - Передаємо ProductService в Контроллер

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

    getOrderOdsyById = async (req: Request, res: Response) => {
    const id = req.params.id;

    if (!id || Array.isArray(id)) {
        throw new AppError("Invalid id", 400, "INVALID_ID");
    }

    const order = await this.orderService.getOrderOdsyById(id);

    return res.status(200).json(order);
    };

    updateOrderOdsy = async (req: Request, res: Response) => {
    const id = req.params.id;

    if (!id || Array.isArray(id)) {
        throw new AppError("Invalid id", 400, "INVALID_ID");
    }

    const dto = req.body as UpdateOrderOdsyDto;

    const errors = validateUpdateOrderDto(dto);

    if (errors.length) {
        throw new AppError("Invalid request body", 400, "VALIDATION_ERROR", errors);
    }

    const order = await this.orderService.updateOrderOdsy(id, dto);

    return res.status(200).json(order);
    };

    deleteOrderOdsy = async (req: Request, res: Response) => {
    const id = req.params.id;

    if (!id || Array.isArray(id)) {
        throw new AppError("Invalid id", 400, "INVALID_ID");
    }

    await this.orderService.deleteOrderOdsy(id);

    return res.sendStatus(204);
    };
} 
    
