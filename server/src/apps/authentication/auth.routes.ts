import express, {Router} from "express";
import { AuthController } from "./auth.controller";

const router = Router();

router.get("/refresh", AuthController.refresh)
router.post("/register", AuthController.register);
router.post("/login", AuthController.login);

export default router;