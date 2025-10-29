import { create } from "domain";
import { LobbyService } from "./lobby.services";
import { Request, Response, NextFunction } from "express";
export const LobbyController = {

    async createLobby(req: Request, res: Response, next: NextFunction): Promise<void> {

        const {name, description, ownerId} = req.body;

        if(!name || !description || !ownerId) {
            res.status(400).json({
                message: "Name, description, and ownerId are required"
            })
        }

        try {
            const lobby = await LobbyService.createLobby(name, description, ownerId)

            res.status(200).json({
                message: "Lobby creation Success!!",
                lobby: lobby
            })
        } catch (err) {
            res.status(400).json({message: "Failed to create lobby"})
            next(err)
        }

    }
}