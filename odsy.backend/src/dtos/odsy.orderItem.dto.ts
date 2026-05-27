export interface CreateOrderItemOdsyDto {
    orderId: string;
    productId: string;
    quantity: number;
}

export interface OrderItemOdsyResponceDto {
    id: string;
    orderId: string;
    productId: string;
    quantity: number;
}

export interface UpdateOrderItemOdsyDto {
    quantity: number;
}