import { Router } from "express";
import {
  getAllQuestionsByUserId,
  getUserById,
  updateUser,
} from "../controllers/user";
import IsAuth from "../auth/auth";

const userRouter = Router();

// GET /:userId
userRouter.get("/:userId", getUserById);

// GET /questions/:userId
userRouter.get("questions/:userId", getAllQuestionsByUserId);

// GET /retrospective/:userId
userRouter.get("retrospective/:userId" );

// PUT /update
userRouter.put("/update", IsAuth, updateUser);

export default userRouter;
