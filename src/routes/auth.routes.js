import express from "express";
import { registerGuardian, loginGuardian, getGuardian } from "../controllers/auth.contoller.js";
import { validateRegister, validateLogin } from "../validators/auth.validator.js";
import { requireAuth } from "../middlewares/requireAuth.js";

const router = express.Router()


router.post('/register', validateRegister, registerGuardian);

router.post('/login', validateLogin, loginGuardian);

router.get('/me', requireAuth, getGuardian);

export default router;