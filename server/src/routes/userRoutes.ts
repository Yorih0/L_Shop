// server/src/routes/userRoutes.ts
import { Router } from 'express';
import { 
    register, 
    login, 
    getMe, 
    logout, 
    getUsers, 
    setRole
} from '../controllers/userController';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API для управления пользователями и аутентификации
 */

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Регистрация нового пользователя
 *     tags: [Users]
 *     description: Создаёт нового пользователя и устанавливает сессионную cookie
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: Регистрация успешна
 *       400:
 *         description: Ошибка валидации данных
 *       500:
 *         description: Ошибка сервера
 */
router.post('/register', register);

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Вход в систему
 *     tags: [Users]
 *     description: Аутентификация пользователя и установка сессионной cookie
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Вход выполнен успешно
 *       400:
 *         description: Логин и пароль обязательны
 *       401:
 *         description: Неверный логин или пароль
 *       500:
 *         description: Ошибка сервера
 */
router.post('/login', login);

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Получение данных текущего пользователя
 *     tags: [Users]
 *     description: Возвращает информацию о пользователе по сессионной cookie
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Данные пользователя получены
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Не авторизован или токен истёк
 */
router.get('/me', getMe);

/**
 * @swagger
 * /users/logout:
 *   post:
 *     summary: Выход из системы
 *     tags: [Users]
 *     description: Очищает сессионную cookie
 *     responses:
 *       200:
 *         description: Выход выполнен успешно
 */
router.post('/logout', logout);

/**
 * @swagger
 * /users/all:
 *   post:
 *     summary: Получение всех пользователей
 *     tags: [Users]
 *     description: Возвращает список всех пользователей (требуются права администратора)
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Список пользователей получен
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Ошибка сервера
 */
router.post('/all', getUsers);

/**
 * @swagger
 * /users/{id}/role:
 *   put:
 *     summary: Изменение роли пользователя
 *     tags: [Users]
 *     description: Обновляет роль пользователя (требуются права администратора)
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID пользователя
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - role
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [user, admin, manager]
 *                 description: Новая роль пользователя
 *                 example: admin
 *     responses:
 *       200:
 *         description: Роль обновлена
 *       400:
 *         description: Не передана роль
 *       404:
 *         description: Пользователь не найден
 *       500:
 *         description: Ошибка сервера
 */
router.put('/:id/role', setRole);

export default router;