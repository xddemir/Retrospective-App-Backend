import { error } from "console";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import { getCache } from "../services/cache";

export function inviteUser(req: any, res: any, next: any) {
  const errors = validationResult(error);
  if (!errors.isEmpty()) {
    const error: any = new Error("Validation Failed.");
    error.statusCode = 422;
    throw error;
  }

  getCache(req.userId)
    .then((retro: any) => {
      if (retro.creatorId !== req.userId) {
        const error: any = new Error(
          "User not authorized for sending invitation!"
        );
        error.statusCode = 422;
        throw error;
      }

      const payload = {
        retroId: retro._id,
        userId: req.userId
      };

      const token = jwt.sign(payload, "demirdogukan", {
        expiresIn: "15m",
      });
      const link = `${process.env.BASE_URL}/addUser/${token}`;

      console.log(link);

      res.status(200).json({ invitationUrl: link });
    })
    .catch((err) => {
      console.log("Value is null");
      next(err);
    });
}
