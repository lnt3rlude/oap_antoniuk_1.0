import { Request, Response } from "express";
import { UserOdsyService } from "../services/odsy.user.service";
import { AppError } from "../errors/AppError";
import { CreateUserOdsyDto, UpdateUserOdsyDto } from "../dtos/odsy.user.dto";
import { validateCreateUserDto, validateUpdateUserDto } from "../validators/user.validator";

export class UserOdsyController {
    constructor(private readonly userService: UserOdsyService) {}

    createUserOdsy = async (req: Request, res: Response) => {
        const errors = validateCreateUserDto(req.body);

        if (errors.length) {
            throw new AppError("Invalid request body", 400, "VALIDATION_ERROR", errors);
        }

        const user = await this.userService.createUserOdsy(
            req.body as CreateUserOdsyDto
        );

        return res.status(201).json(user);
    };

    getAllUsersOdsy = async (req: Request, res: Response) => {
        const users = await this.userService.getAllUsersOdsy();
        return res.status(200).json(users);
    };

    getUserOdsyById = async (req: Request, res: Response) => {
        const id = req.params.id;

        if (!id || Array.isArray(id)) {
            throw new AppError("Invalid id", 400, "INVALID_ID");
        }

        // ЗАХИСТ ВІД IDOR: Дістаємо ID та роль користувача, які розшифрував Auth Middleware з JWT-токена
        const currentUserId = (req as any).user?.id || (req as any).userId;
        const currentUserRole = (req as any).user?.role;

        // Якщо той, хто запитує, це не сам користувач і він не адмін — викидаємо помилку 403
        if (id !== currentUserId && currentUserRole !== 'admin') {
            throw new AppError("Ви не маєте прав для перегляду цього профілю", 403, "FORBIDDEN");
        }

        const user = await this.userService.getUserOdsyById(id);
        return res.status(200).json(user);
    };

    updateUserOdsy = async (req: Request, res: Response) => {
        const id = req.params.id;

        if (!id || Array.isArray(id)) {
            throw new AppError("Invalid id", 400, "INVALID_ID");
        }

        // ЗАХИСТ ВІД IDOR: Не дозволяємо хакеру редагувати чужий профіль
        const currentUserId = (req as any).user?.id || (req as any).userId;
        const currentUserRole = (req as any).user?.role;

        if (id !== currentUserId && currentUserRole !== 'admin') {
            throw new AppError("Ви не маєте прав для редагування цього профілю", 403, "FORBIDDEN");
        }

        const errors = validateUpdateUserDto(req.body);

        if (errors.length) {
            throw new AppError("Invalid request body", 400, "VALIDATION_ERROR", errors);
        }

        const user = await this.userService.updateUserOdsy(id, req.body);
        return res.status(200).json(user);
    };

    deleteUserOdsy = async (req: Request, res: Response) => {
        const id = req.params.id;

        if (!id || Array.isArray(id)) {
            throw new AppError("Invalid id", 400, "INVALID_ID");
        }

        // ЗАХИСТ ВІД IDOR: Дістаємо ID та роль користувача з мідлвари
        const currentUserId = (req as any).user?.id || (req as any).userId;
        const currentUserRole = (req as any).user?.role;

        console.log("Хто видаляє (ID):", currentUserId, "| Його роль:", currentUserRole);

        if (id !== currentUserId && currentUserRole !== 'admin') {
            throw new AppError("Ви не маєте прав для видалення цього користувача", 403, "FORBIDDEN");
        }

        await this.userService.deleteUserOdsy(id);

        return res.sendStatus(204);
    };
}