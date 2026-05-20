import { Request, Response } from "express";
import { ReviewService } from "../services/reviewService";
import { getUserById } from "../services/userService";

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: Управление отзывами на товары
 */

/**
 * @swagger
 * /reviews/{id}:
 *   get:
 *     summary: Получение отзывов о товаре
 *     tags: [Reviews]
 *     description: Возвращает все отзывы для указанного товара
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID товара
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Успешное получение отзывов
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Review'
 *       500:
 *         description: Ошибка сервера
 */
export const getReviewsId = (req: Request, res: Response) => {
    try {
        const productId = Number(req.params.id);
        const reviews = ReviewService.getReviews(productId);
        res.json(reviews);
    } catch (error) {
        console.error("Ошибка в getReview:", error);
        res.status(500).json({ error: "Ошибка сервера" });
    }
};

/**
 * @swagger
 * /reviews/{id}:
 *   post:
 *     summary: Создание нового отзыва
 *     tags: [Reviews]
 *     description: Добавляет новый отзыв для указанного товара
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID товара
 *         schema:
 *           type: number
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
 *                 type: number
 *                 description: ID пользователя, оставляющего отзыв
 *                 example: 1
 *               rating:
 *                 type: number
 *                 enum: [1, 2, 3, 4, 5]
 *                 description: Оценка товара от 1 до 5
 *                 example: 5
 *               comment:
 *                 type: string
 *                 description: Текст отзыва
 *                 example: "Отличный телефон, всем рекомендую!"
 *     responses:
 *       201:
 *         description: Отзыв успешно создан
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       404:
 *         description: Пользователь не найден
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Пользователь не найден"
 *       500:
 *         description: Ошибка сервера
 */
export const createReview = async (req: Request, res: Response) => {
    try {
        const productId = Number(req.params.id);
        const { userId, rating, comment } = req.body;

        const user = await getUserById(userId);

        if (!user) {
            return res.status(404).json({ error: "Пользователь не найден" });
        }

        const newReview = ReviewService.createReview({
            id: 0,
            userId,
            userName: user.login,
            productId,
            rating,
            comment,
            date: new Date().toISOString()
        });

        return res.status(201).json(newReview);

    } catch (error) {
        console.error("Ошибка создания:", error);
        return res.status(500).json({ error: "Ошибка сервера" });
    }
};

/**
 * @swagger
 * /reviews/{id}:
 *   delete:
 *     summary: Удаление отзыва
 *     tags: [Reviews]
 *     description: Удаляет отзыв по его ID (требуются права администратора)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID отзыва
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Отзыв успешно удалён
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 deletedId:
 *                   type: number
 *                   example: 1
 *       404:
 *         description: Отзыв не найден
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Отзыв не найден"
 *       500:
 *         description: Ошибка сервера
 */
export const deleteReview = (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const result = ReviewService.deleteProduct(id);

        if (!result) {
            return res.status(404).json({ error: "Отзыв не найден" });
        }

        return res.json({ success: true, deletedId: id });

    } catch (error) {
        console.error("Ошибка удаления:", error);
        return res.status(500).json({ error: "Ошибка сервера" });
    }
};