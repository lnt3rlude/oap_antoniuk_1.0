import { Router } from "express";
import { CategoryOdsyController } from "../controllers/category.odsy.controller";
import { CategoryOdsyService } from "../services/odsy.category.service";
import { CategoryOdsyRepository } from "../repositories/category.odsy.repository";

const router = Router();

const categoryRepository = new CategoryOdsyRepository();
const categoryService = new CategoryOdsyService(categoryRepository);
const categoryController = new CategoryOdsyController(categoryService);

router.post("/", categoryController.createCategoryOdsy);

router.get("/", categoryController.getAllCategoryOdsy);

router.get("/:id", categoryController.getCategoryOdsyById);

router.patch("/:id", categoryController.updateCategoryOdsy);

router.delete("/:id", categoryController.deleteCategoryOdsy);

export default router;