import { Router } from 'express';
import { register, login ,getMe,logout,getUsers,setRole} from '../controllers/userController';

const router = Router();

router.get('/me',getMe);

router.post('/register', register);
router.post('/login', login);
router.post('/logout',logout)
router.post('/all',getUsers)

router.put('/:id/role',setRole)

export default router;