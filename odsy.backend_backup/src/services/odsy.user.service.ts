import { CreateUserOdsyDto, 
         UserOdsyResponseDto, 
         UpdateUserOdsyDto 
        } from "../dtos/odsy.user.dto";

import { randomUUID } from "crypto";

import { UserOdsyRepository } from "../repositories/user.odsy.repository";

import { AppError } from "../errors/AppError";

import { getTop5MVP } from "../3lab"

type User = {
        id: string;
        userName: string
        email: string;
    }

export class UserOdsyService {
    constructor(
        private repo: UserOdsyRepository
    ) {}

    async createUserOdsy(dto: CreateUserOdsyDto): Promise<User> {
        const user: User = {
            id: randomUUID(),
            userName: dto.userName,
            email: dto.email,
        };

        return await this.repo.create(user);
    }

    async getAllUsersOdsy(): Promise<User[]> {
        return await this.repo.findAll();
    }

    async getUserOdsyById(id: string): Promise<User> {
        const user = await this.repo.findById(id);

        if (!user) {
            throw new AppError(
                "User not found",
                404,
                "USER_NOT_FOUND"
            );
        }
        
        return user;
    }

    async updateUserOdsy(id: string, dto: UpdateUserOdsyDto): Promise<User> {
        const updated = await this.repo.update(id, dto);
    
        if (!updated) {
            throw new AppError (
                "User not found",
                404,
                "USER_NOT_FOUND"
            )
        }

        return updated;
    }

    async deleteUserOdsy(id: string): Promise<void> {
        const deleted = await this.repo.delete(id);

        if (!deleted) {
            throw new AppError(
                "User not found",
                404,
                "USER_NOT_FOUND"
            );
        }
    }

    async getTop5MVP() {
        return getTop5MVP();
  } 
}

// Функція (Що отримує): Що віддає {
//  Змінна = Цей.Масив.Метод }