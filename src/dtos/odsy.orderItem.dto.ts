export interface CreateOrderItemOdsyDto {
    id: string;
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
    id: string;
    orderId: string;
    productId: string;
    quantity: number;
}