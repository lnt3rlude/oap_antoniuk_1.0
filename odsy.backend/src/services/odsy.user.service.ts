import { CreateUserOdsyDto, 
         UserOdsyResponseDto, 
         UpdateUserOdsyDto 
        } from "../dtos/odsy.user.dto";

import { randomUUID } from "crypto";
import { UserOdsyRepository } from "../repositories/user.odsy.repository";
import { AppError } from "../errors/AppError";
import { getTop5MVP } from "../3lab";
import { hashPassword } from "../utils/crypto.utils"; 

type User = {
    id: string;
    userName: string;
    email: string;
    password?: string;
    role?: string;
}

export class UserOdsyService {
    constructor(
        private repo: UserOdsyRepository
    ) {}

    async createUserOdsy(dto: CreateUserOdsyDto): Promise<UserOdsyResponseDto> {
        const hashedPassword = hashPassword(dto.password);

        const user: User = {
            id: randomUUID(),
            userName: dto.userName,
            email: dto.email,
            password: hashedPassword, // Передаємо хеш в об'єкт для бази
            role: "user"               // Дефолтна роль для нових користувачів
        };

        await this.repo.create(user);

        return {
            id: user.id,
            userName: user.userName,
            email: user.email
        };
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
        const updateData: Partial<User> = { ...dto };
        if (dto.password) {
            updateData.password = hashPassword(dto.password);
        }

        const updated = await this.repo.update(id, updateData);
    
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
}