import { Router } from "express";
import { upload } from "../../middleware/multerConfig";
import { ProfileController } from "./profile.controller";

const router = Router();

router.put('/username', ProfileController.editUsername)
router.post('/picture', upload.single('picture'), ProfileController.updateProfilePicture)