import { Router } from "express";
import {
  getAllQuestionsByUserId,
  getRetroHistoryById,
  getUserById,
  updateUser,
} from "../controllers/user";
import IsAuth from "../auth/auth";
import { getUsers } from "../controllers/retrospective";

const userRouter = Router();

// GET /:userId
userRouter.get("/:userId", getUserById);

// GET /
userRouter.get("/", getUsers);

// GET /questions/:userId
userRouter.get("/questions/:userId", getAllQuestionsByUserId);

// GET /retrospective/:userId
userRouter.get("/retrospectives/:userId", IsAuth, getRetroHistoryById);

// PUT /update
userRouter.put("/update", IsAuth, updateUser);

export default userRouter;
