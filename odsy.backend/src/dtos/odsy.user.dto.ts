export interface CreateUserOdsyDto { 
  userName: string;
  email: string;
  password: string; 
}

export interface UserOdsyResponseDto { 
  id: string;
  userName: string;
  email: string;
}

export interface UpdateUserOdsyDto {
  userName?: string;
  email?: string;
  password?: string; 
}

export interface LoginOdsyDto {
  email: string;
  password: string;
}

