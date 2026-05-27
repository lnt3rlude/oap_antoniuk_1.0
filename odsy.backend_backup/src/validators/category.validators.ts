import { CreateCategoryOdsyDto, UpdateCategoryOdsyDto } from "../dtos/odsy.category.dto";

function requireString(value: any, fieldName: string, minLen = 1) {
    if (typeof value !== "string" || value.trim().length < minLen) {
        return {
            field: fieldName,
            message: `${fieldName} must be a non-empty string`
        };
    }
    return null;
}

export function validateCreateCategoryDto(dto: CreateCategoryOdsyDto) {
    const errors = [];

    const e1 = requireString(dto.name, "name", 2);
    if (e1) errors.push(e1);

    return errors;
}

export function validateUpdateCategoryDto(dto: UpdateCategoryOdsyDto) {
    const errors = [];

    if (dto.name !== undefined) {
        const e1 = requireString(dto.name, "name", 2);
        if (e1) errors.push(e1);
    }

    return errors;
}