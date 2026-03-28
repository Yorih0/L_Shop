import { Router } from 'express';
import { register, login ,getMe} from '../controllers/userController';

const router = Router();

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Регистрация пользователя
 *     responses:
 *       200:
 *         description: Успешная регистрация
 */
router.post("/register", register);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Авторизация пользователя
 *     responses:
 *       200:
 *         description: Успешный вход
 */
router.post("/login", login);

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Получить текущего пользователя
 *     responses:
 *       200:
 *         description: Данные пользователя
 */
router.get("/me", getMe);

export default router;