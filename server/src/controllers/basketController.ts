import { Request, Response } from "express";
import { BasketService } from "../services/basketService";

export const BasketController = {
  getBasket: (req: Request, res: Response) => {
    const userId = Number(req.params.userId);
    try {
      const basket = BasketService.getBasket(userId);
      res.json(basket);
    } catch (err: any) {
      res.status(404).json({ message: err.message });
    }
  },

  updateBasket: (req: Request, res: Response) => {
    const userId = Number(req.params.userId);
    const updatedBasket = req.body; // массив BasketItem[]
    try {
      const basket = BasketService.setBasket(userId, updatedBasket);
      res.json(basket);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  },
};