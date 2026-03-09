export interface Product {
    id: number
    price: number
    count: number

    name: string
    description: string
    shortDesc: string
    category: 'iphone' | 'ipad' | 'mac' | 'watch' | 'airpods' | 'accessories'
    colors: string[]
    storage?: string
    image: string
}