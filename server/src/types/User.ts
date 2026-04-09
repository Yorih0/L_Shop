export interface User {
    id: number;
    login: string;
    password: string;
    phone: string;
    role: "user" | "admin" | "manager";
}

export interface RegisterRequest {
    login: string;
    password: string;
    repeatPassword: string;
    phone: string;
}

export interface LoginRequest {
    login: string;
    password: string;
}

export interface AuthResponse {
    user: User;
    token: string;
}