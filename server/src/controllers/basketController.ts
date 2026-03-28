import { Request, Response } from "express";
import { BasketService } from "../services/basketService";

/**
 * Контроллер корзины
 */
export const BasketController = {

  /**
   * Получить корзину пользователя
   * @param {Request} req - запрос, params.userId = ID пользователя
   * @param {Response} res - ответ с массивом BasketItem[]
   */
  getBasket: (req: Request, res: Response) => {
    const userId = Number(req.params.userId);
    try {
      const basket = BasketService.getBasket(userId);
      res.json(basket);
    } catch (err: any) {
      res.status(404).json({ message: err.message });
    }
  },

  /**
   * Обновить корзину пользователя
   * @param {Request} req - запрос, params.userId = ID пользователя, body = массив BasketItem[]
   * @param {Response} res - ответ с обновлённой корзиной
   */
  updateBasket: (req: Request, res: Response) => {
    const userId = Number(req.params.userId);
    const updatedBasket = req.body;
    try {
      const basket = BasketService.setBasket(userId, updatedBasket);
      res.json(basket);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  },
};