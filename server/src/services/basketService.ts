import { BasketItem, Basket } from "../types/Basket";
import fs from "fs";
import path from "path";

// Make sure the db directory exists
const dbDir = path.join(__dirname, "../db");
const dbPath = path.join(dbDir, "baskets.json");

// Create db directory if it doesn't exist
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const readDB = (): Basket[] => {
  if (!fs.existsSync(dbPath)) {
    // Create empty baskets file if it doesn't exist
    writeDB([]);
    return [];
  }
  try {
    const data = fs.readFileSync(dbPath, "utf-8");
    return JSON.parse(data) as Basket[];
  } catch (error) {
    console.error("Error reading baskets DB:", error);
    return [];
  }
};

const writeDB = (data: Basket[]) => {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing baskets DB:", error);
    throw new Error("Failed to save basket data");
  }
};

/**
 * Сервис для работы с корзиной
 */
export const BasketService = {

  /**
   * Получить корзину пользователя
   * @param {number} userId - ID пользователя
   * @returns {BasketItem[]} список товаров в корзине
   */
  getBasket: (userId: number): BasketItem[] => {
    const baskets = readDB();
    const userBasket = baskets.find(b => b.user_id === userId);
    return userBasket ? userBasket.basket : [];
  },

  /**
   * Обновить корзину пользователя
   * @param {number} userId - ID пользователя
   * @param {BasketItem[]} newBasket - новая корзина
   * @returns {BasketItem[]} обновлённая корзина
   */
  setBasket: (userId: number, newBasket: BasketItem[]): BasketItem[] => {
    const baskets = readDB();
    let userBasket = baskets.find(b => b.user_id === userId);

    if (!userBasket) {
      baskets.push({ user_id: userId, basket: newBasket });
    } else {
      userBasket.basket = newBasket;
    }

    writeDB(baskets);
    return newBasket;
  },
};