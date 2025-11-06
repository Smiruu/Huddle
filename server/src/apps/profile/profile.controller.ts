import { Request, Response, NextFunction } from "express";
import { ProfileServices } from "./profile.services";

export const ProfileController = {
  async editUsername(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id: userId } = (req as any).user;
      const { username } = req.body;
        
      if(!username) {
        return next(new Error("Missing Username, please input fields"))
      }

      console.log(userId)
      const newUsername = await ProfileServices.editUsername(username, userId);

      res.status(200).json({
        message: 'Username successfully updated',
        username: newUsername
      })
    } catch (err: any) {
        console.error("profile.controller: Error on username update:", err?.message)
        next(err)
    }
  },

  async updateProfilePicture(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const file = req.file
    const { id: userId } = (req as any).user;

    if(!file){
        res.status(400).json({message: "Upload a file please"})
        return;
    }

    const newProfileUrl = await ProfileServices.editProfilePicture(
        file.buffer,userId,  file.mimetype
    )

    res.status(200).json({
        message:"Profile picture update successful",
        profileUrl: newProfileUrl
    })
    } catch (err: any) {
        console.error("profile.controller: Error on profile update:", err?.message)
        next(err)
    }
  }
};
