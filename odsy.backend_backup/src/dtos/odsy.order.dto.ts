export interface CreateOrderOdsyDto { // Що вводить користувач
  userId: string;
  totalPrice: number;
  status: "pending" | "paid" | "shipped" | "cancelled";
}

export interface OrderOdsyResponseDto { // Що сервер віддає клієнту у відповідь
  id: string;
  userId: string;
  totalPrice: number;
  status: "pending" | "paid" | "shipped" | "cancelled";
  createdAt: string; // Задає сервер
}

export interface UpdateOrderOdsyDto {
  userId?: string;
  totalPrice?: number;
  status?: "pending" | "paid" | "shipped" | "cancelled";
  createdAt?: string;
} 