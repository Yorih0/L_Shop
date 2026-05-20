// server/src/types/User.ts (РАСШИРЕННЫЙ)
export interface User {
    id: number;
    login: string;
    password: string;
    phone: string;
    role: "user" | "admin" | "manager";
    createdAt?: string;    // Дата регистрации
    lastLogin?: string;    // Последний вход
    isActive?: boolean;    // Активен ли аккаунт
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
    user: Omit<User, 'password'>;
    token: string;
}

export interface UpdateUserRequest {
    phone?: string;
    role?: "user" | "admin" | "manager";
}

export interface ChangePasswordRequest {
    oldPassword: string;
    newPassword: string;
    confirmNewPassword: string;
}