import fs from "fs";
import path from "path";
import { Review } from "../types/Review";

const path_products = path.join(__dirname, "../db/review.json");

export class ReviewService {
    static getReviews(productId?: number): Review[] {
        const reviews: Review[] = JSON.parse(
            fs.readFileSync(path_products, "utf-8")
        );

        if (productId) {
            return reviews.filter(r => r.productId === Number(productId));
        }

        return reviews;
    }

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

    static deleteProduct(id: number): boolean {
        const reviews = this.getReviews();

        const filtered = reviews.filter(r => r.id !== id);

        if (filtered.length === reviews.length) return false;

        fs.writeFileSync(path_products, JSON.stringify(filtered, null, 2));

        return true;
    }
}