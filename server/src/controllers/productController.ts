import { Request, Response } from "express";
import { ProductService } from "../services/productService";
import { Product } from "../types/Product";

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Управление товарами
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Получение списка товаров
 *     tags: [Products]
 *     description: Возвращает отфильтрованный, отсортированный список товаров
 *     parameters:
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *         description: Поиск по названию товара
 *       - in: query
 *         name: filter
 *         schema: { type: string, enum: [iphone, ipad, mac, watch, airpods, accessories, TV] }
 *         description: Фильтр по категории
 *       - in: query
 *         name: sort
 *         schema: { type: string, enum: [price, price_rev, name, name_rev] }
 *         description: Сортировка товаров
 *     responses:
 *       200:
 *         description: Успешное получение списка товаров
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       500:
 *         description: Ошибка сервера
 */
export const getProducts = (req: Request, res: Response) => {
  try {
    const { search, filter, sort } = req.query;
    
    const products = ProductService.getFilterProducts(
      search as string,
      filter as string,
      sort as string
    );
    
    res.json(products);
  } catch (error) {
    console.error("Ошибка в getProducts:", error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
};

/**
 * @swagger
 * /products/id:
 *   get:
 *     summary: Получение товаров по ID
 *     tags: [Products]
 *     description: Возвращает товары, ID которых переданы в массиве
 *     parameters:
 *       - in: query
 *         name: id
 *         schema: { type: array, items: { type: number } }
 *         description: Массив ID товаров
 *         style: form
 *         explode: false
 *     responses:
 *       200:
 *         description: Успешное получение товаров
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       500:
 *         description: Ошибка сервера
 */
export const getProductsId = (req: Request, res: Response) => {
  try {
    const { id } = req.query;
    const products = ProductService.getProductsId((id as unknown) as number[]);
    res.json(products);
  } catch (error) {
    console.error("Ошибка в getProductsId:", error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
};

/**
 * @swagger
 * /products/recommendations:
 *   post:
 *     summary: Получение рекомендаций
 *     tags: [Products]
 *     description: Возвращает рекомендованные товары на основе тегов пользователя
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tags:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     tag: { type: string }
 *                     score: { type: number }
 *     responses:
 *       200:
 *         description: Успешное получение рекомендаций
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       500:
 *         description: Ошибка сервера
 */
export const getRecommendations = (req: Request, res: Response) => {
  try {
    const { tags } = req.body;
    const products = ProductService.getRecommendedProducts(tags);
    res.json(products);
  } catch (error) {
    console.error("Ошибка рекомендаций:", error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
};

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Создание нового товара
 *     tags: [Products]
 *     security: [{ cookieAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               price: { type: number }
 *               count: { type: number }
 *               category: { type: string, enum: [iphone, ipad, mac, watch, airpods, accessories, TV] }
 *               image: { type: string }
 *               tags: { type: array, items: { type: string } }
 *     responses:
 *       201:
 *         description: Товар успешно создан
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       500:
 *         description: Ошибка сервера
 */
export const createProduct = (req: Request, res: Response) => {
  try {
    const { name, price, count, category, image, tags }: Product = req.body;
    const newProduct = ProductService.createProduct({
      name, price, count, category, image, tags
    });
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Ошибка создания:", error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
};

/**
 * @swagger
 * /products/{id}:
 *   patch:
 *     summary: Редактирование товара
 *     tags: [Products]
 *     security: [{ cookieAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: number }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               price: { type: number }
 *               count: { type: number }
 *               category: { type: string }
 *               image: { type: string }
 *               tags: { type: array, items: { type: string } }
 *     responses:
 *       200:
 *         description: Товар успешно обновлён
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       500:
 *         description: Ошибка сервера
 */
export const editProduct = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedData: Product = req.body;
    const updated = ProductService.editProduct(Number(id), updatedData);
    res.json(updated);
  } catch (error) {
    console.error("Ошибка редактирования:", error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
};

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Удаление товара
 *     tags: [Products]
 *     security: [{ cookieAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: number }
 *     responses:
 *       200:
 *         description: Товар успешно удалён
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 deletedId: { type: number }
 *       500:
 *         description: Ошибка сервера
 */
export const deleteProduct = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = ProductService.deleteProduct(Number(id));
    res.json({ success: true, deletedId: id });
  } catch (error) {
    console.error("Ошибка удаления:", error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
};