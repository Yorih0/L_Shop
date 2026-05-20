// server/src/routes/reviewRoutes.ts
import { Router } from "express";
import { getReviewsId, createReview, deleteReview } from "../controllers/reviewController";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: API для управления отзывами на товары
 */

/**
 * @swagger
 * /reviews/{id}:
 *   get:
 *     summary: Получить все отзывы о товаре
 *     tags: [Reviews]
 *     description: Возвращает массив отзывов для указанного товара
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID товара
 *     responses:
 *       200:
 *         description: Успешный ответ
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Review'
 *       500:
 *         description: Ошибка сервера
 *   
 *   post:
 *     summary: Создать новый отзыв
 *     tags: [Reviews]
 *     description: Добавляет новый отзыв к товару (требуется авторизация)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID товара
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - rating
 *               - comment
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: ID пользователя
 *                 example: 1
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 description: Оценка от 1 до 5
 *                 example: 5
 *               comment:
 *                 type: string
 *                 description: Текст отзыва
 *                 example: "Отличный товар!"
 *     responses:
 *       201:
 *         description: Отзыв успешно создан
 *       404:
 *         description: Пользователь не найден
 *       500:
 *         description: Ошибка сервера
 *   
 *   delete:
 *     summary: Удалить отзыв
 *     tags: [Reviews]
 *     description: Удаляет отзыв по ID (требуются права администратора)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID отзыва
 *     responses:
 *       200:
 *         description: Отзыв успешно удалён
 *       404:
 *         description: Отзыв не найден
 *       500:
 *         description: Ошибка сервера
 */
router.get("/:id", getReviewsId);
router.post("/:id", createReview);
router.delete("/:id", deleteReview);

export default router;