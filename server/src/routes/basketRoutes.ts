import { Router } from "express";
import { BasketController } from "../controllers/basketController";

const router = Router();

/**
 * @swagger
 * /api/basket/{userId}:
 *   get:
 *     summary: Получить корзину пользователя
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Корзина пользователя
 */
router.get("/:userId", BasketController.getBasket);

/**
 * @swagger
 * /api/basket/{userId}/update:
 *   post:
 *     summary: Обновить корзину
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Корзина обновлена
 */
router.post("/:userId/update", BasketController.updateBasket);

export default router;