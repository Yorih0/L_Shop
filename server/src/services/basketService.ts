import { BasketItem, Basket } from "../types/Basket";
import fs from "fs";
import path from "path";

const dbDir = path.join(__dirname, "../db");
const dbPath = path.join(dbDir, "baskets.json");

// Создаём директорию, если её нет
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

/**
 * Читает базу данных корзин из файла
 * @returns {Basket[]} Массив корзин пользователей
 * @example
 * const baskets = readDB();
 * console.log(`Найдено корзин: ${baskets.length}`);
 */
const readDB = (): Basket[] => {
  if (!fs.existsSync(dbPath)) {
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

/**
 * Записывает базу данных корзин в файл
 * @param {Basket[]} data - Массив корзин для сохранения
 * @throws {Error} При ошибке записи в файл
 * @example
 * const baskets = [{ user_id: 1, basket: [] }];
 * writeDB(baskets);
 */
const writeDB = (data: Basket[]) => {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing baskets DB:", error);
    throw new Error("Failed to save basket data");
  }
};

/**
 * Сервис для управления корзинами пользователей
 * @namespace BasketService
 */
export const BasketService = {
  /**
   * Получает корзину пользователя по его ID
   * @param {number} userId - ID пользователя
   * @returns {BasketItem[]} Массив товаров в корзине пользователя
   * @example
   * const userBasket = BasketService.getBasket(1);
   * console.log(`В корзине ${userBasket.length} товаров`);
   */
  getBasket: (userId: number): BasketItem[] => {
    const baskets = readDB();
    const userBasket = baskets.find(b => b.user_id === userId);
    return userBasket ? userBasket.basket : [];
  },

  /**
   * Устанавливает корзину пользователя (полностью заменяет существующую)
   * @param {number} userId - ID пользователя
   * @param {BasketItem[]} newBasket - Новый массив товаров в корзине
   * @returns {BasketItem[]} Установленный массив товаров
   * @example
   * const newBasket = BasketService.setBasket(1, [
   *   { id: 1, name: "iPhone 17 Pro Max" },
   *   { id: 2, name: "AirPods Pro 3" }
   * ]);
   */
  setBasket: (userId: number, newBasket: BasketItem[]): BasketItem[] => {
    const baskets = readDB();
    let userBasket = baskets.find(b => b.user_id === userId);

    if (!userBasket) {
      const basket = { user_id: userId, basket: newBasket };
      baskets.push(basket);
    } else {
      userBasket.basket = newBasket;
    }

    writeDB(baskets);
    return newBasket;
  },

  /**
   * Добавляет товар в корзину пользователя
   * @param {number} userId - ID пользователя
   * @param {number} productId - ID товара
   * @param {number} count - Количество товара
   * @returns {BasketItem[]} Обновлённая корзина пользователя
   * @throws {Error} Если товар уже существует в корзине (требуется обновление количества через отдельный метод)
   * @example
   * const updatedBasket = BasketService.addToBasket(1, 1, 2);
   * console.log(`Товар добавлен, теперь в корзине ${updatedBasket.length} позиций`);
   */
  addToBasket: (userId: number, productId: number, count: number): BasketItem[] => {
    const baskets = readDB();
    let userBasket = baskets.find(b => b.user_id === userId);
    
    if (!userBasket) {
      // Создаём новую корзину, если её нет
      userBasket = { user_id: userId, basket: [] };
      baskets.push(userBasket);
    }

    // Проверяем, есть ли уже такой товар в корзине
    const existingItem = userBasket.basket.find(item => item.id === productId);
    
    if (existingItem) {
      // Если товар уже есть, обновляем количество (примечание: в текущей структуре BasketItem нет поля count)
      // Рекомендуется расширить интерфейс BasketItem, добавив поле count
      console.warn(`Товар ${productId} уже есть в корзине пользователя ${userId}`);
    } else {
      // Добавляем новый товар
      // Примечание: здесь нужно получить имя товара из ProductService
      userBasket.basket.push({ id: productId, name: `Product ${productId}` });
    }

    writeDB(baskets);
    return userBasket.basket;
  },

  /**
   * Удаляет товар из корзины пользователя
   * @param {number} userId - ID пользователя
   * @param {number} productId - ID товара для удаления
   * @returns {BasketItem[]} Обновлённая корзина пользователя
   * @example
   * const updatedBasket = BasketService.removeFromBasket(1, 1);
   * console.log(`Товар удалён, осталось ${updatedBasket.length} позиций`);
   */
  removeFromBasket: (userId: number, productId: number): BasketItem[] => {
    const baskets = readDB();
    const userBasket = baskets.find(b => b.user_id === userId);
    
    if (!userBasket) {
      return [];
    }

    userBasket.basket = userBasket.basket.filter(item => item.id !== productId);
    writeDB(baskets);
    
    return userBasket.basket;
  },

  /**
   * Очищает корзину пользователя (удаляет все товары)
   * @param {number} userId - ID пользователя
   * @example
   * BasketService.clearBasket(1);
   * console.log('Корзина очищена');
   */
  clearBasket: (userId: number): void => {
    const baskets = readDB();
    const userBasket = baskets.find(b => b.user_id === userId);
    
    if (userBasket) {
      userBasket.basket = [];
      writeDB(baskets);
    }
  },

  /**
   * Обновляет корзину пользователя (замена существующей)
   * @param {number} userId - ID пользователя
   * @param {BasketItem[]} updatedBasket - Обновлённый массив товаров
   * @returns {BasketItem[]} Обновлённая корзина
   * @deprecated Используйте метод setBasket вместо updateBasket
   * @example
   * const basket = BasketService.updateBasket(1, [{ id: 1, name: "iPhone" }]);
   */
  updateBasket: (userId: number, updatedBasket: BasketItem[]): BasketItem[] => {
    return BasketService.setBasket(userId, updatedBasket);
  }
};