import { LobbyService } from "./lobby.services";
import { Request, Response, NextFunction } from "express";

export const LobbyController = {
  async createLobby(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
   
      const { name, description, game, skillLevel, maxParticipants, tags } = req.body;


      const { id: ownerId } = (req as any).user;


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
        maxParticipants, 
        tags
      );

   
      res.status(201).json({
        message: "Lobby creation Success!!",
        lobby: lobby,
      });
    } catch (err) {
 
      next(err);
    }
  },

  async getLobbies(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      
      const lobbies = await LobbyService.getLobbies();
      
      res.status(200).json({message: "Lobbies here", lobbies: lobbies})
    } catch (err) {
      next(err)
    }
  }
};

