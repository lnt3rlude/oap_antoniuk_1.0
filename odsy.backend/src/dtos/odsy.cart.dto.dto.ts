export interface CreateCartOdsyDto { // Що вводить користувач
  userId: string;
  productId: string;
  quantity: number; 
}

export interface CartOdsyResponseDto { // Що сервер віддає клієнту у відповідь
  id: string;
  userId: string;
  productId: string;
  name: string;
  quantity: number; 
}

export interface UpdateCartOdsyDto {
  quantity?: number; 
}