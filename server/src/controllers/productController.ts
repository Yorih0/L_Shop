import { Request, Response } from "express";
import { ProductService } from "../services/productService";
import { Product } from "../types/Product";

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

export const getProductsId = (req: Request, res: Response) => {
  try {
    const { id } = req.query;

    const products = ProductService.getProductsId(
      (id as unknown) as number[]
    );

    res.json(products);

  } catch (error) {
    console.error("Ошибка в getProductsId:", error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
};

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

export const createProduct = (req: Request, res: Response) => {
  try {
    const { name, price, count, category, image, tags }: Product = req.body;

    const newProduct = ProductService.createProduct({
      name,
      price,
      count,
      category,
      image,
      tags
    });

    res.status(201).json(newProduct);

  } catch (error) {
    console.error("Ошибка создания:", error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
};


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