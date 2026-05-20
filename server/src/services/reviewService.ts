import fs from "fs";
import path from "path";
import { Review } from "../types/Review";

const path_products = path.join(__dirname, "../db/review.json");

export class ReviewService {
    /**
     * Получает отзывы для указанного товара
     * @param {number} [productId] - ID товара (если не указан, возвращает все отзывы)
     * @returns {Review[]} Массив отзывов
     * @example
     * // Получить отзывы для товара с ID 1
     * const reviews = ReviewService.getReviews(1);
     * 
     * // Получить все отзывы
     * const allReviews = ReviewService.getReviews();
     */
    static getReviews(productId?: number): Review[] {
        const reviews: Review[] = JSON.parse(
            fs.readFileSync(path_products, "utf-8")
        );

        if (productId) {
            return reviews.filter(r => r.productId === Number(productId));
        }

        return reviews;
    }

    /**
     * Создаёт новый отзыв
     * @param {Review} newReview - Данные нового отзыва (без ID)
     * @returns {Review} Созданный отзыв с присвоенным ID
     * @example
     * const review = ReviewService.createReview({
     *   id: 0,
     *   userId: 1,
     *   userName: "john_doe",
     *   productId: 1,
     *   rating: 5,
     *   comment: "Excellent product!",
     *   date: new Date().toISOString()
     * });
     */
    static createReview(newReview: Review): Review {
        const reviews = this.getReviews();

        const newId =
            reviews.length > 0 ? Math.max(...reviews.map(r => r.id)) + 1 : 1;

        const review: Review = {
            ...newReview,
            id: newId,
        };

        reviews.push(review);

        fs.writeFileSync(path_products, JSON.stringify(reviews, null, 2));

        return review;
    }

    /**
     * Удаляет отзыв по ID
     * @param {number} id - ID отзыва для удаления
     * @returns {boolean} true - если отзыв был удалён, false - если отзыв не найден
     * @example
     * const isDeleted = ReviewService.deleteProduct(1);
     * if (isDeleted) {
     *   console.log('Review deleted successfully');
     * }
     */
    static deleteProduct(id: number): boolean {
        const reviews = this.getReviews();

        const filtered = reviews.filter(r => r.id !== id);

        if (filtered.length === reviews.length) return false;

        fs.writeFileSync(path_products, JSON.stringify(filtered, null, 2));

        return true;
    }
}