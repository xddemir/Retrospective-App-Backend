import { Router } from "express";
import IsAuth from "../auth/auth";
import {
  createRetro,
  deleteRetroById,
  getAllRetros,
  getAllUsersInRetro,
  getRetroById,
  postUserToRetro,
  updateRetroById,
} from "../controllers/retros";

const retrosRouter = Router();

// PUT /put/:retroId
retrosRouter.put("/put/:retroId", IsAuth, updateRetroById);

// POST /posts/post
retrosRouter.post("/post", IsAuth, createRetro);

// POST /add/:userId
retrosRouter.post("/add", IsAuth, postUserToRetro);

// GET /get/:retroId
retrosRouter.get("/get/:retroId", IsAuth, getRetroById);

// GET /posts/
retrosRouter.get("/gets", IsAuth, getAllRetros);

// GET /allUsers/:retroId
retrosRouter.get("/allUsers/:retroId", getAllUsersInRetro);

// DELETE /delete/:retroId
retrosRouter.delete("/delete/:retroId", IsAuth, deleteRetroById);

export default retrosRouter;
