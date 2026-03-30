export interface Product {
    id:number
    price:number
    count:number
    name:string
    category: 'iphone' | 'ipad' | 'mac' | 'watch' | 'airpods' | 'accessories' | 'TV'
    image:string
    tags?:string[]
}