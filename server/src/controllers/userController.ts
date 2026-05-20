import { Request, Response } from 'express';
import { findUserByLogin, createUser, validateUser,readDB, updateUserByRole } from '../services/userService';
import { User, RegisterRequest, LoginRequest } from '../types/User';
import jwt from "jsonwebtoken";


export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { login, password, repeatPassword, phone }: RegisterRequest = req.body;

        if (!login || !password || !repeatPassword || !phone) {
            res.status(400).json({ message: 'Все поля обязательны для заполнения' });
            return;
        }
        if (password !== repeatPassword) {
            res.status(400).json({ message: 'Пароли не совпадают' });
            return;
        }
        if (password.length < 6) {
            res.status(400).json({ message: 'Пароль должен содержать минимум 6 символов' });
            return;
        }
        const existingUser = await findUserByLogin(login);
        if (existingUser) {
            res.status(400).json({ message: 'Пользователь с таким логином уже существует' });
            return;
        }
        const phoneRegex = /^\+375 \d{2} \d{3} \d{4}$/;
        if (!phoneRegex.test(phone)) {
            res.status(400).json({ message: 'Неверный формат телефона. Используйте +375 (XX) XXX XXXX' });
            return;
        }

        const newUser = await createUser({ login, password, repeatPassword, phone });

        const token = jwt.sign(
        {
            id: newUser.id,
            login: newUser.login,
            phone: newUser.phone,
            role: newUser.role
        },
        "SECRET_KEY",
        { expiresIn: "10m" }
        );

        res.cookie("session", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 10 * 60 * 1000
        });

        res.status(201).json({
            message: 'Регистрация прошла успешно'
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: 'Ошибка при регистрации' });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { login, password }: LoginRequest = req.body;

        if (!login || !password) {
            res.status(400).json({ message: 'Логин и пароль обязательны' });
            return;
        }

        const user = await validateUser(login, password);

        if (!user) {
            res.status(401).json({ message: 'Неверный логин или пароль' });
            return;
        }

        const token = jwt.sign(
        {
            id: user.id,
            login: user.login,
            phone: user.phone,
            role: user.role
        },
        "SECRET_KEY",
        { expiresIn: "30m" }
        );

        res.cookie("session", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 30 * 60 * 1000
        });
        res.json({ message: "Вход выполнен успешно" });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Ошибка при входе' });
    }
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
    const token = req.cookies.session;

    if (!token) {
        res.status(401).json({ error: "Not authenticated" });
        return;
    }

    try {
        const decoded = jwt.verify(token, "SECRET_KEY") as User;

        res.json({
            id: decoded.id,
            login: decoded.login,
            phone: decoded.phone,
            role: decoded.role
        });
    } catch {
        res.status(401).json({ error: "Token expired" });
    }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  res.clearCookie("session", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    path: "/"
  });

  res.status(200).json({ message: "Logged out" });
};

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const db = await readDB();
    res.json(db.users);
  } catch (error) {
    console.error("Ошибка при получении пользователей:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

export const setRole = async (req :Request,res:Response): Promise<void> =>{
    try {
        const userId = Number(req.params.id);
        const {role} = req.body;
        if(!role){
            res.status(400).json({message:"Не передана роль"})
        }
        const user = await updateUserByRole(userId,role);

        if(!user){
            res.status(404).json({message:"Пользователь не найден"});
            return;
        }

        res.status(200).json({message:"Роль обновлена",user:user});
    }catch (error){
        console.error("Ошибка изменения роли пользователяй:",error);
        res.status(500).json({message: "Ошибка сервера"});
    }
};