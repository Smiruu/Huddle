import supabase from "../supabase/supabase";
import { Request, Response, NextFunction } from "express";

const accessHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try{
    const authHeader = req.headers.authorization;

  if (!authHeader) {
    console.warn("accessHandler: No Authorization header present");
    return res.status(401).json({
      message: "Unauthorized: No token provided",
    });
  }
  const token = authHeader?.split(" ")[1];

  if (!token) {
    console.warn("accessHandler: No token found in Authorization header");
    return res.status(401).json({
      message: "Unauthorized: No token provided",
    });
  }
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

  if (error) {
    console.error("accessHandler: Supabase getUser error:", error.message);
    return res.status(401).json({
      message: "Unauthorized: Invalid token",
    });
  }

  if (!user) {
    console.warn("Access Handler: Token valid but no user found.");
    return res.status(401).json({ error: "Unauthorized: User not found." });
  }

  (req as any).user = user;
  next();
} catch (err) {
    console.error("Access Handler: An unexpected error occurred.", err);
    res.status(500).json({ error: "Internal Server Error" });
}
};

export default accessHandler;