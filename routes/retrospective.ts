import { Router } from "express";
import IsAuth from "../auth/auth";
import {
  addAnswer,
  addUser,
  createRetro,
  endRetro,
  getAnswers,
  getRetro,
  getUsers,
  updateRetro,
} from "../controllers/retrospective";

const retrosRouter = Router();

// PUT /update
retrosRouter.put("/update", IsAuth, updateRetro);

// POST /create
retrosRouter.post("/create", IsAuth, createRetro);

// POST /addUser
retrosRouter.post("/addUser/:sessionToken", addUser)

// POST /addAnswer
retrosRouter.post("/addAnswer", addAnswer)

// GET /
retrosRouter.get("/", IsAuth, getRetro);

// GET /users
retrosRouter.get("/users", IsAuth, getUsers);

// GET /answers
retrosRouter.get("/answers", IsAuth, getAnswers)

// GET /endRetro
retrosRouter.post("/endRetro", IsAuth, endRetro)

export default retrosRouter;
