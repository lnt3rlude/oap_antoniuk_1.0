import { Router } from "express";
import { UserOdsyController } from "../controllers/user.odsy.controller";
import { UserOdsyService } from "../services/odsy.user.service";
import { UserOdsyRepository } from "../repositories/user.odsy.repository";
import { requireAuth } from "../middleware/auth.middleware"; // <-- ОБОВ'ЯЗКОВО ІМПОРТУЙ (перевір правильність шляху до файлу мідлвари!)

const router = Router();

const UserRepository = new UserOdsyRepository();
const userService = new UserOdsyService(UserRepository);
const userController = new UserOdsyController(userService);

// Створення юзера (реєстрація) — відкритий маршрут
router.post("/", userController.createUserOdsy);

// Отримання списку всіх (можна теж закрити за допомогою requireAuth, якщо треба)
router.get("/", userController.getAllUsersOdsy);

router.get("/top5-mvp", userController.getTop5MVP);

// ЗАХИЩЕНІ МАРШРУТИ (додаємо requireAuth першим параметром)
router.get("/:id", requireAuth, userController.getUserOdsyById);

router.put("/:id", requireAuth, userController.updateUserOdsy);

router.delete("/:id", requireAuth, userController.deleteUserOdsy);

export default router;
