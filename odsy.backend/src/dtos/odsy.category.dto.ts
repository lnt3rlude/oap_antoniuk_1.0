export interface CreateCategoryOdsyDto { // Що вводить користувач
  name: string;
}

export interface CategoryOdsyResponseDto { // Що сервер віддає клієнту у відповідь
  id: string;
  name: string;
}

export interface UpdateCategoryOdsyDto {
  name?: string;
}