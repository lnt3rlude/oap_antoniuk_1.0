export interface CreateUserOdsyDto { // Що вводить користувач
  userName: string;
  email: string;
}

export interface UserOdsyResponseDto { // Що сервер віддає клієнту у відповідь
  id: string;
  userName: string;
  email: string;
}

export interface UpdateUserOdsyDto {
  userName?: string;
  email?: string;
}

// "?" - Опціональні поля
