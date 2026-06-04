import { Request, Response } from "express";
import { CategoryOdsyService } from "../services/odsy.category.service";
import { CreateCategoryOdsyDto, UpdateCategoryOdsyDto } from "../dtos/odsy.category.dto";
import { AppError } from "../errors/AppError";
import { validateCreateCategoryDto, validateUpdateCategoryDto } from "../validators/category.validators";

// ХЕЛПЕР ДЛЯ ЗАХИСТУ ВІД XSS: Перетворює небезпечні HTML-символи на безпечні текстові мнемоніки
const escapeHtml = (text: string): string => {
    if (typeof text !== 'string') return text;
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
};

export class CategoryOdsyController {
    constructor(private readonly categoryService: CategoryOdsyService ) {} // Dependency Injections - Передаємо ProductService в Контроллер

        createCategoryOdsy = async (req: Request, res: Response) => {
    let dto = req.body as CreateCategoryOdsyDto;

    const errors = validateCreateCategoryDto(dto);

    if (errors.length) {
        throw new AppError("Invalid request body", 400, "VALIDATION_ERROR", errors);
    }

    if (dto && dto.name) {
        const sanitizedName = escapeHtml(dto.name);
        req.body.name = sanitizedName;
        dto = { ...dto, name: sanitizedName }; // Перезаписуємо dto новим об'єктом
    }

    const category = await this.categoryService.createCategoryOdsy(dto);

    return res.status(201).json(category);
    };

    
    getAllCategoryOdsy = async (req: Request, res: Response) => {
    const category = await this.categoryService.getAllCategoryOdsy();
    return res.status(200).json(category);
    };

    getCategoryOdsyById = async (req: Request, res: Response) => {
    const id = req.params.id;

    if (!id || Array.isArray(id)) {
        throw new AppError("Invalid id", 400, "INVALID_ID");
    }

    const category = await this.categoryService.getCategoryOdsyById(id);

    return res.status(200).json(category);
    };

    updateCategoryOdsy = async (req: Request, res: Response) => {
    const id = req.params.id;

    if (!id || Array.isArray(id)) {
        throw new AppError("Invalid id", 400, "INVALID_ID");
    }

    let dto = req.body as UpdateCategoryOdsyDto;

    const errors = validateUpdateCategoryDto(dto);

    if (errors.length) {
        throw new AppError("Invalid request body", 400, "VALIDATION_ERROR", errors);
    }

    if (dto && dto.name) {
        const sanitizedName = escapeHtml(dto.name);
        req.body.name = sanitizedName;
        dto = { ...dto, name: sanitizedName };
    }

    const category = await this.categoryService.updateCategoryOdsy(id, dto);

    return res.status(200).json(category);
    };

    deleteCategoryOdsy = async (req: Request, res: Response) => {
    const id = req.params.id;

    if (!id || Array.isArray(id)) {
        throw new AppError("Invalid id", 400, "INVALID_ID");
    }

    await this.categoryService.deleteCategoryOdsy(id);

    return res.sendStatus(204);
    };
} 
