import { Router } from "express";
import { getProducts,getProductsPage } from "../controllers/Product_Controler";

const router  = Router()

router.get("/products",getProducts)
router.get("/",getProductsPage)

export default router 