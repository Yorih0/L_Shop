// server/src/types/Basket.ts (ОБНОВЛЁННЫЙ)
export interface Basket {
    user_id: number;
    basket: BasketItem[];
}

export interface BasketItem {
    id: number;        // ID товара
    name: string;      // Название товара
    count?: number;    // Количество товара (опционально, для будущего расширения)
    price?: number;    // Цена товара на момент добавления (опционально)
}