import {
  CreateOrderItemOdsyDto,
  UpdateOrderItemOdsyDto
} from "../dtos/odsy.orderItem.dto";

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

function requireNumber(value: unknown, fieldName: string, min = 1) {
  if (typeof value !== "number" || value < min) {
    return {
      field: fieldName,
      message: `${fieldName} must be a number >= ${min}`
    };
  }
  return null;
}

export function validateCreateOrderItemDto(dto: CreateOrderItemOdsyDto) {
  const errors: { field: string; message: string }[] = [];

  // Повертаємо requireString, бо тепер це знову рядки (UUID)
  const e1 = requireString(dto.orderId, "orderId", 1);
  if (e1) errors.push(e1);

  const e2 = requireString(dto.productId, "productId", 1);
  if (e2) errors.push(e2);

  // Кількість залишається числом
  const e3 = requireNumber(dto.quantity, "quantity", 1);
  if (e3) errors.push(e3);

  return errors;
}

export function validateUpdateOrderItemDto(dto: UpdateOrderItemOdsyDto) {
  const errors: { field: string; message: string }[] = [];

  if (dto.quantity !== undefined) {
    const e = requireNumber(dto.quantity, "quantity", 1);
    if (e) errors.push(e);
  }

  return errors;
}