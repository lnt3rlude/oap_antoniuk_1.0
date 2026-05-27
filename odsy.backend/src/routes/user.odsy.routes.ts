import { Router } from "express";
import { UserOdsyController } from "../controllers/user.odsy.controller";
import { UserOdsyService } from "../services/odsy.user.service";
import { UserOdsyRepository } from "../repositories/user.odsy.repository";

const router = Router();

const UserRepository = new UserOdsyRepository ();
const userService = new UserOdsyService(UserRepository);
const userController = new UserOdsyController(userService);

router.post("/", userController.createUserOdsy);

router.get("/", userController.getAllUsersOdsy);

router.get("/top5-mvp", userController.getTop5MVP);

router.get("/:id", userController.getUserOdsyById);

router.patch("/:id", userController.updateUserOdsy);

router.delete("/:id", userController.deleteUserOdsy);

export default router;