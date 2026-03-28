import { Router } from "express";
import { BasketController } from "../controllers/basketController";

const router = Router();

router.get("/:userId", BasketController.getBasket);
router.post("/:userId/update", BasketController.updateBasket);

export default router;