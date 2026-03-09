import { Address } from "./Address";

export interface User{
    id:number;
    login:string;
    name:string;
    password:string;
    phone:string;
    role:"user"|"admin";
    address:Address;
}