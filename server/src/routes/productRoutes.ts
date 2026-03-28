import { Router } from "express";
import { getProducts,getProductsId } from "../controllers/productController";

const router  = Router()

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Получить все товары
 *     responses:
 *       200:
 *         description: Список товаров
 */
router.get("/", getProducts);

/**
 * @swagger
 * /api/products/id:
 *   get:
 *     summary: Получить товар по id
 *     responses:
 *       200:
 *         description: Один товар
 */
router.get("/id", getProductsId);

export default router 