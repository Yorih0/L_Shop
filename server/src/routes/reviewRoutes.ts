import { Router } from "express";
import { getReviewsId, createReview, deleteReview } from "../controllers/reviewController";

const router = Router()

router.get("/:id", getReviewsId)

router.post("/:id", createReview)

router.delete("/:id", deleteReview)

export default router