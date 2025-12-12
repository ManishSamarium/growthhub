import express from 'express';
import { register,login, logout } from '../controller/user.control.js';

const router = express.Router()

router.post("/signup", register);
router.post("/login", login);
router.post("/logout", logout);





export default router;