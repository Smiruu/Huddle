import { Request, Response, NextFunction } from "express";

import { AuthService } from "./auth.services";
import { AuthError } from "@supabase/supabase-js";

export const AuthController = {
  async register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
      res
        .status(400)
        .json({ message: "Email, password, and username are required" });
      return;
    }

    try {
      const { user } = await AuthService.register(email, password, username);
      res.status(201).json({
        message: "User registered successfully, Please proceed to login.",
        userId: user?.id,
      });
    } catch (err) {
      if (err instanceof AuthError) {
        if (
          err.message.includes("User already registered") ||
          err.message.includes("unique constraint")
        ) {
          res.status(409).json({ message: "Email is already in use" });
          return;
        }
      }
      console.error("auth.controller: Registration error:", err);
      next(err);
    }
  },
};
