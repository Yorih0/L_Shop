export interface Products{
    id:number;
    name:string;
    description: string;
    shortDesc: string;
    category: 'iphone' | 'ipad' | 'mac' | 'watch' | 'airpods' | 'accessories';
    price:number;
    color:string;
    size:string;
    image: string;
}