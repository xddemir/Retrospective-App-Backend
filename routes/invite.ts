import { Router } from "express";
import { inviteUser } from "../controllers/invite";
import IsAuth from "../auth/auth";

const inviteRouter = Router();

inviteRouter.post("/", IsAuth, inviteUser);

export default inviteRouter;
