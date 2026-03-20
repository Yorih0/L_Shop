import { Request, Response } from "express";
import { ProductService } from "../services/productService";

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

export const getProductsId = (req:Request,res:Response) => {
  try{
    const {id} = req.query;

    const products = ProductService.getProductsId(
      (id as unknown) as number[]
    );
  }catch(error){
    console.error("Ошибка в getProductsId:", error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
};