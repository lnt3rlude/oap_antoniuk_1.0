import { CreateOrderOdsyDto,
         OrderOdsyResponseDto,
         UpdateOrderOdsyDto,
 } from "../dtos/odsy.order.dto";

import { randomUUID } from "crypto";

import { OrderOdsyRepository } from "../repositories/order.odsy.repository";

import { AppError } from "../errors/AppError";

type Order = {
        id: string;
        userId: string;
        totalPrice: number;
        status: "pending" | "paid" | "shipped" | "cancelled";
        createdAt: string;
    }

export class OrderOdsyService {
    constructor(private repo: OrderOdsyRepository) {}

    async createOrderOdsy(dto: CreateOrderOdsyDto): Promise<Order> {
        const order: Order = {
            id: randomUUID(),
            userId: dto.userId,
            totalPrice: dto.totalPrice,
            status: dto.status,
            createdAt: new Date().toISOString(),
        };
     
        return await this.repo.create(order);
    }

    async getAllOrderOdsy(): Promise<Order[]> {
        return await this.repo.findAll();
    }
    
    async getOrderOdsyById(id: string): Promise<Order> {
        const order = await this.repo.findById(id);

        if (!order) {
            throw new AppError(
                "Order not found",
                404,
                "ORDER_NOT_FOUND"
            );
        }

        return order;
    }
    
    async updateOrderOdsy(id: string, dto: UpdateOrderOdsyDto): Promise<Order> {
        const updated = await this.repo.update(id, dto);
    
        if (!updated) {
            throw new AppError (
                "Order not found",
                404,
                "ORDER_NOT_FOUND"
            )
        }

        return updated;
    }
    
    async deleteOrderOdsy(id: string): Promise<void> {
        const deleted = await this.repo.delete(id);
    
            if (!deleted) {
                throw new AppError(
                    "Order not found",
                    404,
                    "ORDER_NOT_FOUND"
                );
            }
        }
    }