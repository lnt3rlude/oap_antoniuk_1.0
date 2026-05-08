import { CreateProductOdsyDto, 
         ProductOdsyResponseDto, 
         UpdateProductOdsyDto 
        } from "../dtos/odsy.product.dto";

import { randomUUID } from "crypto";

import { ProductOdsyRepository } from "../repositories/product.odsy.repository";

import { AppError } from "../errors/AppError";

type Product = {
    id: string;
    title: string;
    description: string;
    price: number;
    stock: number;
    categoryId: string;
    sales: number;
}

export class ProductOdsyService {
  constructor(private repo: ProductOdsyRepository) {}

    async createProductOdsy(dto: CreateProductOdsyDto): Promise<Product> {
        const product: Product = {
            id: randomUUID(),
            sales: 0,
            title: dto.title,
            description: dto.description,
            price: dto.price,
            stock: dto.stock,
            categoryId: dto.categoryId,
        };
     
        return await this.repo.create(product);
    }

    async getAllProductOdsy(): Promise<Product[]> {
        return await this.repo.findAll();
    }
    
    async getProductOdsyById(id: string): Promise<Product> {
        const product = await this.repo.findById(id);

        if (!product) {
            throw new AppError(
                "Product not found",
                404,
                "PRODUCT_NOT_FOUND"
            );
        }

        return product;
    }

    async updateProductOdsy(id: string, dto: UpdateProductOdsyDto): Promise<Product> {
        const updated = await this.repo.update(id, dto);
    
        if (!updated) {
            throw new AppError (
                "Product not found",
                404,
                "PRODUCT_NOT_FOUND"
            )
        }

        return updated;
    }
    
    async deleteProductOdsy(id: string): Promise<void> {
        const deleted = await this.repo.delete(id);

        if (!deleted) {
            throw new AppError(
                "Product not found",
                404,
                "PRODUCT_NOT_FOUND"
            );
        }
    }

    // Додаткові можливості

    async findByTitle(title: string) {
        return await this.repo.findByTitle(title);
    }

    async findByCategory(categoryId: string) {
        return await this.repo.findByCategory(categoryId);
    }

    async findByPriceRange(min: number, max: number) {
        return await this.repo.findByPriceRange(min, max);
    }

    // Три самих популярних моделей в кожній категорії як вибірку зробити логіка сервіс

    async findTopProductsByCategory() {
        const products = await this.repo.findAll();

        const grouped: Record<string, Product[]> = {};

        for (const product of products) {
            if (!grouped[product.categoryId]) {
                grouped[product.categoryId] = [];
            }

            grouped[product.categoryId].push(product);
        }

        const result: Record<string, Product[]> = {};

        for (const categoryId in grouped) {
            result[categoryId] = grouped[categoryId]
                .sort((a, b) => b.sales - a.sales)
                .slice(0, 3);
        }

        return result;
    }
}

