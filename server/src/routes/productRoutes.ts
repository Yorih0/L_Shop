import { Router } from "express";
import { getProducts,getProductsId,getRecommendations } from "../controllers/productController";

const router  = Router()

router.get("/",getProducts)
router.get("/id",getProductsId)
router.post("/recommendations", getRecommendations);

export default router 