import { LobbyService } from "./lobby.services";
import { Request, Response, NextFunction } from "express";

export const LobbyController = {
  async createLobby(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // 1. Get lobby details from the request body
      const { name, description, game, skillLevel } = req.body;

      // 2. Get the ownerId securely from the req.user object (set by middleware)
      const { id: ownerId } = (req as any).user;

      // 3. Get the token securely from the authorization header


      // 4. Validate all inputs, including the ones from auth
      if (!name || !game || !skillLevel || !ownerId ) {
        // Send to error middleware
        return next(new Error("Missing required fields or not authenticated"));
      }

      // 5. Call the service with all 6 parameters
      const lobby = await LobbyService.createLobby(
        name,
        description,
        ownerId,
        game,
        skillLevel,
        
      );

      // 6. Send the successful response
      res.status(201).json({
        message: "Lobby creation Success!!",
        lobby: lobby,
      });
    } catch (err) {
      // 7. On any failure, pass to the error middleware
      next(err);
    }
  },
};

