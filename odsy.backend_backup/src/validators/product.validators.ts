import { CreateProductOdsyDto, UpdateProductOdsyDto } from "../dtos/odsy.product.dto";

// helpers
function requireString(value: unknown, fieldName: string, minLen = 1) {
  if (typeof value !== "string" || value.trim().length < minLen) {
    return {
      field: fieldName,
      message: `${fieldName} must be a non-empty string`
    };
  }
  return null;
}

function requireNumber(value: unknown, fieldName: string, min = 0) {
  if (typeof value !== "number" || value < min) {
    return {
      field: fieldName,
      message: `${fieldName} must be a number >= ${min}`
    };
  }
  return null;
}

function requireArray(value: unknown, fieldName: string) {
  if (!Array.isArray(value)) {
    return {
      field: fieldName,
      message: `${fieldName} must be an array`
    };
  }
  return null;
}

export function validateCreateProductDto(dto: CreateProductOdsyDto) {
  const errors: { field: string; message: string }[] = [];

  const t1 = requireString(dto.title, "title", 2);
  if (t1) errors.push(t1);

  const t2 = requireString(dto.description, "description", 5);
  if (t2) errors.push(t2);

  const t3 = requireNumber(dto.price, "price", 0);
  if (t3) errors.push(t3);

  const t4 = requireNumber(dto.stock, "stock", 0);
  if (t4) errors.push(t4);

  const t5 = requireString(dto.categoryId, "categoryId", 1);
  if (t5) errors.push(t5);

  return errors;
}

export function validateUpdateProductDto(dto: UpdateProductOdsyDto) {
  const errors: { field: string; message: string }[] = [];

  if (dto.title !== undefined) {
    const e = requireString(dto.title, "title", 2);
    if (e) errors.push(e);
  }

  if (dto.description !== undefined) {
    const e = requireString(dto.description, "description", 5);
    if (e) errors.push(e);
  }

  if (dto.price !== undefined) {
    const e = requireNumber(dto.price, "price", 0);
    if (e) errors.push(e);
  }

  if (dto.stock !== undefined) {
    const e = requireNumber(dto.stock, "stock", 0);
    if (e) errors.push(e);
  }

  if (dto.categoryId !== undefined) {
    const e = requireString(dto.categoryId, "categoryId", 1);
    if (e) errors.push(e);
  }

  return errors;
}