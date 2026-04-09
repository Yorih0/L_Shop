import fs from "fs"
import path from "path"
import { Product } from "../types/Product"

const path_products = path.join(__dirname, "../db/products.json")

export class ProductService {
    static getAllProductds(): Product[] {
        return JSON.parse(fs.readFileSync(path_products, 'utf8'));
    }
    static getFilterProducts(search?: string, filter?: string, sort?: string): Product[] {
        let products = this.getAllProductds()

        if (search) {
            products = products.filter(pr => pr.name.toLocaleLowerCase().includes(search.toLocaleLowerCase()))
        }

        if (filter) {
            products = products.filter(pr => pr.category === filter)
        }

        if (sort) {
            switch (sort) {
                case "price":
                    products.sort((pr1, pr2) => pr1.price - pr2.price)
                    break
                case "price_rev":
                    products.sort((pr1, pr2) => pr2.price - pr1.price)
                    break
                case "name":
                    products.sort((pr1, pr2) => pr1.name.localeCompare(pr2.name))
                    break
                case "name_rev":
                    products.sort((pr1, pr2) => pr1.name.localeCompare(pr2.name))
                    break
            }
        }

        return products
    }

    static getProductsId(id: number[]): Product[] {
        let products = this.getAllProductds()

        return products.filter((x) => id.includes(x.id))
    }

    static getRecommendedProducts(userTags: { tag: string, score: number }[]): Product[] {
        const products = this.getAllProductds();

        const scored = products.map(product => {
            let score = 0;

            if (product.tags) {
                product.tags.forEach(tag => {
                    const userTag = userTags.find(t => t.tag === tag);
                    if (userTag) {
                        score += userTag.score;
                    }
                });
            }

            return { product, score };
        });

        return scored
            .filter(x => x.score > 0)
            .sort((a, b) => b.score - a.score)
            .map(x => x.product);
    }
    static saveProducts(products: Product[]) {
        fs.writeFileSync(path_products, JSON.stringify(products, null, 2), "utf8");
    }

    static createProduct(data: Omit<Product, "id">): Product {
        const products = this.getAllProductds();

        const newProduct: Product = {
            id: products.length > 0 ? products[products.length - 1].id + 1 : 1,
            ...data
        };

        products.push(newProduct);
        this.saveProducts(products);

        return newProduct;
    }

    static editProduct(id: number, data: Partial<Product>): Product {
        const products = this.getAllProductds();
        const index = products.findIndex(p => p.id === id);

        if (index === -1) {
            throw new Error("Product not found");
        }

        products[index] = { ...products[index], ...data };
        this.saveProducts(products);

        return products[index];
    }

    static deleteProduct(id: number): boolean {
        const products = this.getAllProductds();
        const newProducts = products.filter(p => p.id !== id);

        if (newProducts.length === products.length) {
            throw new Error("Product not found");
        }

        this.saveProducts(newProducts);
        return true;
    }
}
