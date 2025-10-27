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
        userEmail: user?.email,
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

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "Email and password are required"});
      return;
    }

    try {
      const {session, user} = await AuthService.login(email, password);
      if(session?.refresh_token) {
        res.cookie('refresh_token', session.refresh_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
          maxAge: 1000 * 60 * 60 * 24 * 30,
        })
      }

      res.status(200).json({
        message: "Login successful",
        access_token: session?.access_token,
        user: user,
      })
    } catch (err) {
      if (err instanceof AuthError) {
        if (err.message.includes("Invalid login credentials")) {
          res.status(401).json({ message: "Invalid email or password" });
          return;
        }
      }
      next(err);
    }
  },
  async refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
    const refresh_token = req.cookies['refresh_token'];

    if(!refresh_token){
      res.status(400).json({message: "No refresh token provided"});
      return;
    }

    try {
      
       const {session, user} = await AuthService.refresh(refresh_token);

       res.cookie('refresh_token', session?.refresh_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
          maxAge: 1000 * 60 * 60 * 24 * 30,
        })

        res.status(200).json({
          message: "Token refreshed successfully",
          access_token: session?.access_token,
          user: user,
        })
    } catch (err) { 
        res.status(401).json({message: "Invalid refresh token"});
        next(err);
    }
  },
  
};
