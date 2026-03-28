import fs from "fs"
import path from "path"
import { Product } from "../types/Product"

const path_products =  path.join(__dirname,"../db/products.json")

/**
 * Сервис для работы с товарами
 */
export class ProductService {

    /**
     * Получить все товары
     * @returns {Product[]} массив всех товаров
     */
    static getAllProductds(): Product[] {
        return JSON.parse(fs.readFileSync(path_products, 'utf8'));
    }

    /**
     * Получить товары с фильтрацией, поиском и сортировкой
     * @param {string} [search] - строка поиска по названию
     * @param {string} [filter] - фильтр по категории
     * @param {string} [sort] - сортировка (price, price_rev, name, name_rev)
     * @returns {Product[]} отфильтрованный список товаров
     */
    static getFilterProducts(search?: string, filter?: string, sort?: string): Product[] {
        let products = this.getAllProductds();

        if (search) {
            products = products.filter(pr =>
                pr.name.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (filter) {
            products = products.filter(pr => pr.category === filter);
        }

        if (sort) {
            switch (sort) {
                case "price":
                    products.sort((a, b) => a.price - b.price);
                    break;
                case "price_rev":
                    products.sort((a, b) => b.price - a.price);
                    break;
                case "name":
                    products.sort((a, b) => a.name.localeCompare(b.name));
                    break;
                case "name_rev":
                    products.sort((a, b) => b.name.localeCompare(a.name));
                    break;
            }
        }

        return products;
    }

    /**
     * Получить товары по списку ID
     * @param {number[]} id - массив идентификаторов товаров
     * @returns {Product[]} найденные товары
     */
    static getProductsId(id: number[]): Product[] {
        const products = this.getAllProductds();
        return products.filter(x => id.includes(x.id));
    }
}