

import supabase from "../supabase/supabase";
import { AuthenticatedSocket } from "./socket.types";

type SocketNextFunction = (err?: Error) => void;

export const authMiddleware = async (
  socket: AuthenticatedSocket, 
  next: SocketNextFunction 
) => {
  const token = socket.handshake.auth.token;

  if (!token) {
    return next(new Error("Authentication error: No token provided"));
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

  if (error || !user) {
    return next(new Error("Authentication error: Invalid token."));
  }
  
  const { data, error: profileError } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", user.id)
    .single();

  if (profileError) {
    console.warn(`Could not fetch profile for user ${user.id}:`, profileError.message);
  }

  socket.userId = user.id;
  socket.username = data?.username || 'unknown';

  next();
};