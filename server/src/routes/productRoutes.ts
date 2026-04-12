import { Router } from "express";
import { getProducts,getProductsId,getRecommendations,createProduct,editProduct,deleteProduct } from "../controllers/productController";

const router  = Router()

router.get("/",getProducts)
router.get("/id",getProductsId)

router.post("/recommendations", getRecommendations)
router.post("/",createProduct)


router.patch("/:id",editProduct)

router.delete("/:id",deleteProduct)

export default router