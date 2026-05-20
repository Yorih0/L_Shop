// server/src/controllers/basketController.ts (ДОБАВЛЯЕМ updateBasket)
import { Request, Response } from "express";
import { BasketService } from "../services/basketService";
import { Basket, BasketItem } from "../types/Basket";

/**
 * @swagger
 * tags:
 *   name: Basket
 *   description: Управление корзиной пользователя
 */

export const BasketController = {
  /**
   * @swagger
   * /basket/{userId}:
   *   get:
   *     summary: Получение корзины пользователя
   *     tags: [Basket]
   */
  getBasket: (req: Request, res: Response): void => {
    try {
      const userId = Number(req.params.userId);
      const basket = BasketService.getBasket(userId);
      res.json(basket);
    } catch (error) {
      console.error("Ошибка в getBasket:", error);
      res.status(500).json({ error: "Ошибка сервера" });
    }
  },

  /**
   * @swagger
   * /basket/{userId}:
   *   post:
   *     summary: Добавление товара в корзину
   *     tags: [Basket]
   */
  addToBasket: (req: Request, res: Response): void => {
    try {
      const userId = Number(req.params.userId);
      const { productId, count } = req.body;
      const basket = BasketService.addToBasket(userId, productId, count);
      res.json(basket);
    } catch (error) {
      console.error("Ошибка в addToBasket:", error);
      res.status(500).json({ error: "Ошибка сервера" });
    }
  },

  /**
   * @swagger
   * /basket/{userId}:
   *   put:
   *     summary: Полное обновление корзины пользователя
   *     tags: [Basket]
   *     description: Заменяет всю корзину пользователя новым массивом товаров
   *     parameters:
   *       - in: path
   *         name: userId
   *         required: true
   *         schema: { type: number }
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               basket:
   *                 type: array
   *                 items:
   *                   $ref: '#/components/schemas/BasketItem'
   *     responses:
   *       200:
   *         description: Корзина успешно обновлена
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/BasketItem'
   *       500:
   *         description: Ошибка сервера
   */
  updateBasket: (req: Request, res: Response): void => {
    try {
      const userId = Number(req.params.userId);
      const { basket } = req.body;
      const updatedBasket = BasketService.updateBasket(userId, basket);
      res.json(updatedBasket);
    } catch (error) {
      console.error("Ошибка в updateBasket:", error);
      res.status(500).json({ error: "Ошибка сервера" });
    }
  },

  /**
   * @swagger
   * /basket/{userId}:
   *   delete:
   *     summary: Удаление товара из корзины
   *     tags: [Basket]
   */
  removeFromBasket: (req: Request, res: Response): void => {
    try {
      const userId = Number(req.params.userId);
      const productId = Number(req.query.productId as string);
      const basket = BasketService.removeFromBasket(userId, productId);
      res.json(basket);
    } catch (error) {
      console.error("Ошибка в removeFromBasket:", error);
      res.status(500).json({ error: "Ошибка сервера" });
    }
  },

  /**
   * @swagger
   * /basket/clear/{userId}:
   *   delete:
   *     summary: Очистка корзины пользователя
   *     tags: [Basket]
   */
  clearBasket: (req: Request, res: Response): void => {
    try {
      const userId = Number(req.params.userId);
      BasketService.clearBasket(userId);
      res.json({ success: true });
    } catch (error) {
      console.error("Ошибка в clearBasket:", error);
      res.status(500).json({ error: "Ошибка сервера" });
    }
  },
};