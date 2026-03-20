export interface Basket {
    user_id: number;
    basket: BasketItem[];
}
export interface BasketItem{
    id:number
    name:string
}   