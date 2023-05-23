import { error, info } from "console";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import { getCache } from "../services/cache";
import { OutlookSender } from "../services/mail";

export function inviteUser(req: any, res: any, next: any) {
  const errors = validationResult(error);
  if (!errors.isEmpty()) {
    const error: any = new Error("Validation Failed.");
    error.statusCode = 422;
    throw error;
  }

  let linkUrl: string;

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
        userId: req.userId,
      };

      const token = jwt.sign(payload, "demirdogukan", {
        expiresIn: "15m",
      });

      const link = `${process.env.BASE_URL}/addUser/${token}`;

      linkUrl = link;

      let sender: OutlookSender = new OutlookSender({
        service: "hotmail",
        auth: {
          user: process.env.EMAIL_USER!,
          pass: process.env.EMAIL_PASSWORD!,
        },
      });

      return sender.sendMail({
        from: process.env.EMAIL_USER!,
        to: "",
        subject: "Retro Invitation Link",
        text: linkUrl,
      });
    })
    .then((result: any) => {
      res.status(200).json({ message: result, invitationUrl: linkUrl });
    })
    .catch((err) => {
      console.log("Value is null");
      next(err);
    });
}
