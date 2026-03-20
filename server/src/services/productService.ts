import fs from "fs"
import path from "path"
import { Product } from "../types/Product"

const path_products =  path.join(__dirname,"../db/products.json")

export class ProductService{
    static getAllProductds():Product[] {
        return JSON.parse(fs.readFileSync(path_products, 'utf8'));
    }
    static getFilterProducts(search?:string,filter?:string,sort?:string):Product[]{
        let products = this.getAllProductds()

        if(search){
            products = products.filter(pr=>pr.name.toLocaleLowerCase().includes(search.toLocaleLowerCase()))
        }

        if(filter){
            products = products.filter(pr=>pr.category === filter)
        }

        if(sort){
            switch(sort){
                case "price":
                    products.sort((pr1,pr2)=>pr1.price - pr2.price)
                    break
                case "price_rev":
                    products.sort((pr1,pr2)=>pr2.price - pr1.price)
                    break
                case "name":
                    products.sort((pr1,pr2)=>pr1.name.localeCompare(pr2.name))
                    break
                case "name_rev":
                    products.sort((pr1,pr2)=>pr1.name.localeCompare(pr2.name))
                    break
            }
        }

        return products
    }
    static getProductsId(id:number[]):Product[]{
        let products = this.getAllProductds()

        return products.filter((x)=>id.includes(x.id))
    }
}