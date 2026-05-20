import fs from "fs"
import path from "path"
import { Product } from "../types/Product"

const path_products = path.join(__dirname, "../db/products.json")

export class ProductService {
    /**
     * Получает все товары из базы данных
     * @returns {Product[]} Массив всех товаров
     * @example
     * const allProducts = ProductService.getAllProducts();
     */
    static getAllProducts(): Product[] {
        return JSON.parse(fs.readFileSync(path_products, 'utf8'));
    }

    /**
     * Получает отфильтрованные и отсортированные товары
     * @param {string} [search] - Поисковая строка для фильтрации по названию
     * @param {string} [filter] - Категория для фильтрации
     * @param {string} [sort] - Тип сортировки ('price', 'price_rev', 'name', 'name_rev')
     * @returns {Product[]} Отфильтрованный и отсортированный массив товаров
     * @example
     * const filtered = ProductService.getFilterProducts('iphone', 'iphone', 'price');
     */
    static getFilterProducts(search?: string, filter?: string, sort?: string): Product[] {
        let products = this.getAllProducts()

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
                case "name_rev":
                    products.sort((pr1, pr2) => pr1.name.localeCompare(pr2.name))
                    break
            }
        }

        return products
    }

    /**
     * Получает товары по массиву ID
     * @param {number[]} id - Массив ID товаров
     * @returns {Product[]} Массив товаров с указанными ID
     * @example
     * const products = ProductService.getProductsId([1, 2, 3]);
     */
    static getProductsId(id: number[]): Product[] {
        let products = this.getAllProducts()
        return products.filter((x) => id.includes(x.id))
    }

    /**
     * Получает рекомендованные товары на основе тегов пользователя
     * @param {{tag: string, score: number}[]} userTags - Массив тегов с весами
     * @returns {Product[]} Отсортированный массив рекомендованных товаров
     * @example
     * const recommendations = ProductService.getRecommendedProducts([
     *   { tag: 'new', score: 5 },
     *   { tag: 'popular', score: 3 }
     * ]);
     */
    static getRecommendedProducts(userTags: { tag: string, score: number }[]): Product[] {
        const products = this.getAllProducts();

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

    /**
     * Сохраняет товары в файл
     * @param {Product[]} products - Массив товаров для сохранения
     */
    static saveProducts(products: Product[]) {
        fs.writeFileSync(path_products, JSON.stringify(products, null, 2), "utf8");
    }

    /**
     * Создаёт новый товар
     * @param {Omit<Product, "id">} data - Данные нового товара (без ID)
     * @returns {Product} Созданный товар с присвоенным ID
     * @throws {Error} При ошибке записи в файл
     * @example
     * const newProduct = ProductService.createProduct({
     *   name: 'iPhone 15',
     *   price: 999,
     *   count: 5,
     *   category: 'iphone',
     *   image: '/img/iphone15.png'
     * });
     */
    static createProduct(data: Omit<Product, "id">): Product {
        const products = this.getAllProducts();

        const newProduct: Product = {
            id: products.length > 0 ? products[products.length - 1].id + 1 : 1,
            ...data
        };

        products.push(newProduct);
        this.saveProducts(products);

        return newProduct;
    }

    /**
     * Редактирует существующий товар
     * @param {number} id - ID товара для редактирования
     * @param {Partial<Product>} data - Частичные данные для обновления
     * @returns {Product} Обновлённый товар
     * @throws {Error} Если товар с указанным ID не найден
     * @example
     * const updated = ProductService.editProduct(1, { price: 1099 });
     */
    static editProduct(id: number, data: Partial<Product>): Product {
        const products = this.getAllProducts();
        const index = products.findIndex(p => p.id === id);

        if (index === -1) {
            throw new Error("Product not found");
        }

        products[index] = { ...products[index], ...data };
        this.saveProducts(products);

        return products[index];
    }

    /**
     * Удаляет товар по ID
     * @param {number} id - ID товара для удаления
     * @returns {Product} Удалённый товар
     * @throws {Error} Если ID некорректен или товар не найден
     * @example
     * const deleted = ProductService.deleteProduct(1);
     */
    static deleteProduct(id: number) {
        if (typeof id !== "number") {
            throw new Error("Invalid product id");
        }

        const products = this.getAllProducts();
        const index = products.findIndex(p => p.id === id);

        if (index === -1) {
            throw new Error("Product not found");
        }

        const [deleted] = products.splice(index, 1);
        this.saveProducts(products);

        return deleted;
    }
}