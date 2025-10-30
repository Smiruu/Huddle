import { Router } from "express";
import { LobbyController } from "./lobby.controller";
import accessHandler from "../../middleware/accessHandler";

const router = Router()

router.post("/create", accessHandler, LobbyController.createLobby);
router.get("/", accessHandler, LobbyController.getLobbies)

export default router;