import { Router } from "express";
import { getProducts,getProductsId } from "../controllers/productController";

const router  = Router()

router.get("/",getProducts)
router.get("/id",getProductsId)

export default router 