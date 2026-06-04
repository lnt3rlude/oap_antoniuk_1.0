import { Router } from "express";
import { ProductOdsyController } from "../controllers/product.odsy.controller";
import { ProductOdsyService } from "../services/odsy.product.service";
import { ProductOdsyRepository } from "../repositories/product.odsy.repository";

const router = Router();

const ProductRepository = new ProductOdsyRepository();
const productService = new ProductOdsyService(ProductRepository);
const productController = new ProductOdsyController(productService);

router.get("/top-by-category", productController.findTopProductsByCategory);

router.get("/", productController.getAllProductOdsy);

router.get("/:id", productController.getProductOdsyById);

router.post("/", productController.createProductOdsy);

router.put("/:id", productController.updateProductOdsy);

router.delete("/:id", productController.deleteProductOdsy);

export default router;