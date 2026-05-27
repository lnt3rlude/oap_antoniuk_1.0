import { CreateCategoryOdsyDto, 
         CategoryOdsyResponseDto, 
         UpdateCategoryOdsyDto 
        } from "../dtos/odsy.category.dto";

import { randomUUID } from "crypto";

import { CategoryOdsyRepository } from "../repositories/category.odsy.repository";

import { AppError } from "../errors/AppError";

type Category = {
        id: string; // Унікальний ідентифікатор сутності
        name: string;
    }

export class CategoryOdsyService {
    constructor(private repo: CategoryOdsyRepository) {}

    async createCategoryOdsy(dto: CreateCategoryOdsyDto): Promise<Category> {
        const category: Category = {
            id: randomUUID(),
            name: dto.name,
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