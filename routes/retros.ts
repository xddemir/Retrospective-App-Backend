import { Router } from "express";
import IsAuth from "../auth/auth";
import {
  addUser,
  createRetro,
  getAllRetros,
  getRetroById,
  getUsers,
  updateRetroById,
} from "../controllers/retros";

const retrosRouter = Router();

// PUT /put/:retroId
retrosRouter.put("/put/:retroId", IsAuth, updateRetroById);

// POST /posts/post
retrosRouter.post("/post", IsAuth, createRetro);

// POST /addUser
retrosRouter.post("/addUser/:sessionToken", addUser)

// GET /get/:retroId
retrosRouter.get("/get/:retroId", IsAuth, getRetroById);

// GET /posts/
retrosRouter.get("/gets", IsAuth, getAllRetros);

// GET /allUsers/:retroId
retrosRouter.get("/allUsers/:retroId", getUsers);

export default retrosRouter;
