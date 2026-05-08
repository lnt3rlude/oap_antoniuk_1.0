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

    const user = await this.userService.getUserOdsyById(id);
    return res.status(200).json(user);
    };

    updateUserOdsy = async (req: Request, res: Response) => {
    const id = req.params.id;

    if (!id || Array.isArray(id)) {
        throw new AppError("Invalid id", 400, "INVALID_ID");
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

    await this.userService.deleteUserOdsy(id);

    return res.sendStatus(204);
    };

    getTop5MVP = async (req: Request, res: Response) => {
        const data = await this.userService.getTop5MVP();
        return res.json(data);
    }
}