import {
    CreateOrderItemOdsyDto,
    OrderItemOdsyResponceDto,
    UpdateOrderItemOdsyDto,
    } from "../dtos/odsy.orderItem.dto"

import { randomUUID } from "crypto";

import { OrderItemOdsyRepository } from "../repositories/orderItem.odsy.repository";

import { AppError } from "../errors/AppError";

import { ProductOdsyRepository } from "../repositories/product.odsy.repository";

type OrderItem = {
        id: string;
        orderId: string;
        productId: string;
        quantity: number;
    }

export class OrderItemOdsyService {
    constructor(
        private repo: OrderItemOdsyRepository
    ) {}

    async createOrderItemOdsy(dto: CreateOrderItemOdsyDto) {
        const product = await this.repo.findById(dto.productId);

        if (!product) {
            throw new AppError("Product not found", 404, "PRODUCT_NOT_FOUND");
        }

        if (dto.quantity <= 0) {
            throw new AppError("Quantity must be > 0", 400, "INVALID_QUANTITY");
        }

        if (product.quantity < dto.quantity) {
            throw new AppError("Not enough stock", 400, "NOT_ENOUGH_STOCK");
        }

        const orderItem = {
            id: randomUUID(),
            orderId: dto.orderId,
            productId: dto.productId,
            quantity: dto.quantity,
        };

        return this.repo.create(orderItem);
    }

    async getAllOrderItemOdsy(): Promise<OrderItem[]> {
        return await this.repo.findAll();
    }

    async getOrderItemOdsyById(id: string): Promise<OrderItem> {
        const orderItem = await this.repo.findById(id);

        if (!orderItem) {
            throw new AppError(
                "OrderItem not found",
                404,
                "ORDERITEM_NOT_FOUND"
            );
        }

        return orderItem;
    }
    
    async updateOrderItemOdsy(id: string, dto: UpdateOrderItemOdsyDto): Promise<OrderItem> {
        const updated = await this.repo.update(id, dto);
    
        if (!updated) {
            throw new AppError (
                "OrderItem not found",
                404,
                "ORDERITEM_NOT_FOUND"
            )
        }

        return updated;
    }
    
    async deleteOrderItemOdsy(id: string): Promise<void> {
        const deleted = await this.repo.delete(id);
    
            if (!deleted) {
                throw new AppError(
                    "OrderItem not found",
                    404,
                    "ORDERITEM_NOT_FOUND"
                );
            }
        }
    }