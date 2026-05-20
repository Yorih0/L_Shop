// server/src/routes/productRoutes.ts (обновлённый)
import { Router } from "express";
import { 
    getProducts,
    getProductsId,
    getRecommendations,
    createProduct,
    editProduct,
    deleteProduct 
} from "../controllers/productController";

const router = Router();

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Получение списка товаров
 *     tags: [Products]
 */
router.get("/", getProducts);

/**
 * @swagger
 * /products/id:
 *   get:
 *     summary: Получение товаров по ID
 *     tags: [Products]
 */
router.get("/id", getProductsId);

/**
 * @swagger
 * /products/recommendations:
 *   post:
 *     summary: Получение рекомендаций
 *     tags: [Products]
 */
router.post("/recommendations", getRecommendations);

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Создание нового товара
 *     tags: [Products]
 */
router.post("/", createProduct);

/**
 * @swagger
 * /products/{id}:
 *   patch:
 *     summary: Редактирование товара
 *     tags: [Products]
 */
router.patch("/:id", editProduct);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Удаление товара
 *     tags: [Products]
 */
router.delete("/:id", deleteProduct);

export default router;