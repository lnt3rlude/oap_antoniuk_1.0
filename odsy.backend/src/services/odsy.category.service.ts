import { CreateCategoryOdsyDto, 
         CategoryOdsyResponseDto, 
         UpdateCategoryOdsyDto 
        } from "../dtos/odsy.category.dto";

import { randomUUID } from "crypto";
import { CategoryOdsyRepository } from "../repositories/category.odsy.repository";
import { AppError } from "../errors/AppError";

type Category = {
    id: string; 
    name: string;
}
// 🛡️ Оновлена функція: тепер вона залізобетонно перевіряє, чи передано саме РЯДОК
const sanitizeXss = (text: any): string => {
    if (!text || typeof text !== 'string') {
        return String(text || ''); // Якщо це не рядок, просто перетворюємо на порожній рядок або текст безпечно
    }
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
};

export class CategoryOdsyService {
    constructor(private repo: CategoryOdsyRepository) {}

    async createCategoryOdsy(dto: CreateCategoryOdsyDto): Promise<Category> {
        // Перевіряємо, чи взагалі існує dto та поле name
        const rawName = dto && dto.name ? dto.name : '';
        const safeName = sanitizeXss(rawName);
     
        const category: Category = {
            id: randomUUID(),
            name: safeName, 
        };
     
        return await this.repo.create(category);
    }

    async getAllCategoryOdsy(): Promise<Category[]> {
        return await this.repo.findAll();
    }
    
    async getCategoryOdsyById(id: string): Promise<Category> {
        const category = await this.repo.findById(id);

        if (!category) {
            throw new AppError(
                "Category not found",
                404,
                "CATEGORY_NOT_FOUND"
            );
        }

        return category;
    }

    async updateCategoryOdsy(id: string, dto: UpdateCategoryOdsyDto): Promise<Category> {
        // 🛡️ ЕКРАНУЄМО НАЗВУ ПРИ ОНОВЛЕННІ (Якщо її передали)
        if (dto && dto.name) {
            dto.name = sanitizeXss(dto.name);
        }

        const updated = await this.repo.update(id, dto);
    
        if (!updated) {
            throw new AppError (
                "Category not found",
                404,
                "CATEGORY_NOT_FOUND"
            )
        }

        return updated;
    }
    
    async deleteCategoryOdsy(id: string): Promise<void> {
        const deleted = await this.repo.delete(id);

        if (!deleted) {
            throw new AppError(
                "Category not found",
                404,
                "CATEGORY_NOT_FOUND"
            );
        }
    }
}
