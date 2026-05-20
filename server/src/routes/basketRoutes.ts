// server/src/routes/basketRoutes.ts (ОКОНЧАТЕЛЬНАЯ ВЕРСИЯ)
import { Router } from "express";
import { BasketController } from "../controllers/basketController";

const router = Router();

/**
 * @swagger
 * /basket/{userId}:
 *   get:
 *     summary: Получение корзины пользователя
 *     tags: [Basket]
 *   post:
 *     summary: Добавление товара в корзину
 *     tags: [Basket]
 *   put:
 *     summary: Полное обновление корзины
 *     tags: [Basket]
 *   delete:
 *     summary: Удаление товара из корзины
 *     tags: [Basket]
 */
router.get("/:userId", BasketController.getBasket);
router.post("/:userId", BasketController.addToBasket);
router.put("/:userId", BasketController.updateBasket);
router.delete("/:userId", BasketController.removeFromBasket);

/**
 * @swagger
 * /basket/clear/{userId}:
 *   delete:
 *     summary: Очистка корзины пользователя
 *     tags: [Basket]
 */
router.delete("/clear/:userId", BasketController.clearBasket);

export default router;