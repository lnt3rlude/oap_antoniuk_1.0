export interface CreateProductOdsyDto { // Що вводить користувач
  title: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string;
}

export interface ProductOdsyResponseDto { // Що сервер віддає клієнту у відповідь
  id: string; // Унікальний ідентифікатор сутності
  title: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string;
  sales: number;
}

export interface UpdateProductOdsyDto {
  title?: string;
  description?: string;
  price?: number;
  stock?: number;
  categoryId?: string;
}

