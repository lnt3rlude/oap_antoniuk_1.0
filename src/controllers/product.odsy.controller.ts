import { Request, Response } from "express";
import { ProductOdsyService } from "../services/odsy.product.service";
import { CreateProductOdsyDto, UpdateProductOdsyDto } from "../dtos/odsy.product.dto"; 
import { AppError } from "../errors/AppError";
import { validateCreateProductDto, validateUpdateProductDto } from "../validators/product.validators";

export class ProductOdsyController {
    constructor(private readonly productService: ProductOdsyService ) {} // Dependency Injections - Передаємо ProductService в Контроллер

    createProductOdsy = async (req: Request, res: Response) => {
    const errors = validateCreateProductDto(req.body);

    if (errors.length) {
        throw new AppError("Invalid request body", 400, "VALIDATION_ERROR", errors);
    }

    const product = await this.productService.createProductOdsy(
        req.body as CreateProductOdsyDto
    );

    return res.status(201).json(product);
    };
    
    getAllProductOdsy = async (req: Request, res: Response) => {
    const product = await this.productService.getAllProductOdsy();
    return res.status(200).json(product);
    };

    getProductOdsyById = async (req: Request, res: Response) => {
    const id = req.params.id;

    if (!id || Array.isArray(id)) {
        throw new AppError("Invalid id", 400, "INVALID_ID");
    }

    const product = await this.productService.getProductOdsyById(id);
    return res.status(200).json(product);
    };

    updateProductOdsy = async (req: Request, res: Response) => {
    const id = req.params.id;

    if (!id || Array.isArray(id)) {
        throw new AppError("Invalid id", 400, "INVALID_ID");
    }

    const errors = validateUpdateProductDto(req.body);

    if (errors.length) {
        throw new AppError("Invalid request body", 400, "VALIDATION_ERROR", errors);
    }

    const updateProduct = await this.productService.updateProductOdsy(
        id,
        req.body as UpdateProductOdsyDto
    );

    return res.status(200).json(updateProduct);
    };

    deleteProductOdsy = async (req: Request, res: Response) => {
    const id = req.params.id;

    if (!id || Array.isArray(id)) {
        throw new AppError("Invalid id", 400, "INVALID_ID");
    }

    await this.productService.deleteProductOdsy(id);

    return res.sendStatus(204);
    };
        
    findByTitle = async (req: Request, res: Response) => {
    const title = req.query.title as string;

    const result = await this.productService.findByTitle(title);

    return res.status(200).json(result);
    };

    findByCategory = (req: Request, res: Response) => {
        const categoryId = req.query.categoryId as string;

        const result =  this.productService.findByCategory(categoryId);

        return res.status(200).json(result);
    };

    findByPriceRange = (req: Request, res: Response) => {
        const min = Number(req.query.min)
        const max = Number(req.query.max)

        const result =  this.productService.findByPriceRange(min, max);

        return res.status(200).json(result);
    };

    findTopProductsByCategory = (req: Request, res: Response) => {
        const result = this.productService.findTopProductsByCategory();
        return res.status(200).json(result);
    };
}
