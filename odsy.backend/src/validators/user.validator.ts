import { CreateUserOdsyDto, UpdateUserOdsyDto } from "../dtos/odsy.user.dto";

function requireString(value: unknown, fieldName: string, minLen = 1) {
  if (typeof value !== "string" || value.trim().length < minLen) {
    return {
      field: fieldName,
      message: `${fieldName} must be a non-empty string`
    };
  }
  return null;
}

export function validateCreateUserDto(dto: CreateUserOdsyDto) {
  const errors: { field: string; message: string }[] = [];

  const e1 = requireString(dto.userName, "userName", 3);
  if (e1) errors.push(e1);

  const e2 = requireString(dto.email, "email", 5);
  if (e2) errors.push(e2);

  // проста перевірка email
  if (dto.email && !dto.email.includes("@")) {
    errors.push({
      field: "email",
      message: "email must contain '@'"
    });
  }

  return errors;
}

export function validateUpdateUserDto(dto: UpdateUserOdsyDto) {
  const errors: { field: string; message: string }[] = [];

  if (dto.userName !== undefined) {
    const e = requireString(dto.userName, "userName", 3);
    if (e) errors.push(e);
  }

  if (dto.email !== undefined) {
    const e = requireString(dto.email, "email", 5);
    if (e) errors.push(e);

    if (dto.email && !dto.email.includes("@")) {
      errors.push({
        field: "email",
        message: "email must contain '@'"
      });
    }
  }

  return errors;
}