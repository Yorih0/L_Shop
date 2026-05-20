import { Request, Response } from "express";
import { ReviewService } from "../services/reviewService";
import { getUserById } from "../services/userService"

export const getReviewsId = (req: Request, res: Response) => {
    try {
        const productId = Number(req.params.id);

        const reviews = ReviewService.getReviews(productId);

        res.json(reviews);
    } catch (error) {
        console.error("Ошибка в getReview:", error);
        res.status(500).json({ error: "Ошибка сервера" });
    }
};

export const createReview = async (req: Request, res: Response) => {
    try {
        const productId = Number(req.params.id);
        const { userId, rating, comment } = req.body;

        const user = await getUserById(userId);

        if (!user) {
            return res.status(404).json({ error: "Пользователь не найден" });
        }

        const newReview = ReviewService.createReview({
            id: 0,
            userId,
            userName: user.login,
            productId,
            rating,
            comment,
            date: new Date().toISOString()
        });

        return res.status(201).json(newReview);

    } catch (error) {
        console.error("Ошибка создания:", error);
        return res.status(500).json({ error: "Ошибка сервера" });
    }
};

export const deleteReview = (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        const result = ReviewService.deleteProduct(id);

        if (!result) {
            return res.status(404).json({ error: "Отзыв не найден" });
        }

        return res.json({ success: true, deletedId: id });

    } catch (error) {
        console.error("Ошибка удаления:", error);
        return res.status(500).json({ error: "Ошибка сервера" });
    }
};