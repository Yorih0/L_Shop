import { Request , Response } from "express";
import { ProductService } from "../services/Product_Service";
import path from "path";

export const getProducts = ((req:Request,res:Response)=>{
    const { search,filter,sort} = req.query

    const products = ProductService.getFilterProducts(
        search as string,
        filter as string,
        sort as string
    )

    res.json(products)
})
export const getProductsPage =((req:Request,res:Response)=>{
    const pagesPath = path.join(__dirname, "../pages")
    res.sendFile(path.join(pagesPath, "main.html"))
}) 