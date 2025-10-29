import { Router } from "express";
import { LobbyController } from "./lobby.controller";
import accessHandler from "../../middleware/accessHandler";

const router = Router()

router.post("/create", accessHandler, LobbyController.createLobby);

export default router;