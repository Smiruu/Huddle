import { Router } from "express";
import { upload } from "../../middleware/multerConfig";
import { ProfileController } from "./profile.controller";
import accessHandler from "../../middleware/accessHandler";
const router = Router();

router.put('/username', accessHandler, ProfileController.editUsername)
router.post('/picture',accessHandler, upload.single('picture'), ProfileController.updateProfilePicture)

export default router