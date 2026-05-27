import {
  CreateOrderOdsyDto,
  UpdateOrderOdsyDto
} from "../dtos/odsy.order.dto";

function requireString(value: unknown, fieldName: string) {
  if (typeof value !== "string" || value.trim().length === 0) {
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

function requireEnum<T extends string>(
  value: unknown,
  fieldName: string,
  allowed: T[]
) {
  if (typeof value !== "string" || !allowed.includes(value as T)) {
    return {
      field: fieldName,
      message: `${fieldName} must be one of: ${allowed.join(", ")}`
    };
  }
  return null;
}

export function validateCreateOrderDto(dto: CreateOrderOdsyDto) {
  const errors: { field: string; message: string }[] = [];

  const e1 = requireString(dto.userId, "userId");
  if (e1) errors.push(e1);

  const e2 = requireNumber(dto.totalPrice, "totalPrice", 0);
  if (e2) errors.push(e2);

  const e3 = requireEnum(dto.status, "status", [
    "pending",
    "paid",
    "shipped",
    "cancelled"
  ]);
  if (e3) errors.push(e3);

  return errors;
}

export function validateUpdateOrderDto(dto: UpdateOrderOdsyDto) {
  const errors: { field: string; message: string }[] = [];

  if (dto.userId !== undefined) {
    const e = requireString(dto.userId, "userId");
    if (e) errors.push(e);
  }

  if (dto.totalPrice !== undefined) {
    const e = requireNumber(dto.totalPrice, "totalPrice", 0);
    if (e) errors.push(e);
  }

  if (dto.status !== undefined) {
    const e = requireEnum(dto.status, "status", [
      "pending",
      "paid",
      "shipped",
      "cancelled"
    ]);
    if (e) errors.push(e);
  }

  return errors;
}