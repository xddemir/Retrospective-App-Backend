import { validationResult } from "express-validator";
import Retro from "../models/retrospective";
import User from "../models/user";
import { error } from "console";
import { setOrGetCache } from "../services/cache";

export const createRetro = (req: any, res: any, next: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error: any = new Error(
      "Validation Failed, entered data is incorrect."
    );
    error.statusCode = 422;
    throw error;
  }

  const title: string = req.body.title;
  const description: string = req.body.description;
  const date: string = new Date().toISOString().slice(0, 10);
  let creator: any;

  const retro = new Retro({
    title: title,
    description: description,
    date: date,
    creatorId: req.userId,
  });

  retro
    .save()
    .then((result: any) => {
      return User.findById(req.userId);
    })
    .then((user: any) => {
      if (!user?.isAdmin) {
        const error: any = new Error(
          "Only admin users are allowed to create retro."
        );
        error.statusCode = 422;
        throw error;
      }

      creator = user;
      user.retrospectiveHistory.push(retro);
      return user.save();
    })
    .then((result) => {
      res.status(201).json({
        message: "Post created successfully!",
        retro: retro,
        creator: { _id: creator._id, name: creator.name },
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

export const getAllRetros = (req: any, res: any, next: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error: any = new Error(
      "Validation Failed, entered data is incorrect."
    );
    error.statusCode = 422;
    throw error;
  }

  Retro.find()
    .then((retros) => {
      res.status(200).json({
        message: "Fetched All Retrospectives",
        retros: retros,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

export const getRetroById = (req: any, res: any, next: any) => {
  const retroId = req.params.retroId;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error: any = new Error(
      "Validation Failed, entered data is incorrect."
    );
    error.statusCode = 422;
    throw error;
  }

  Retro.findById(retroId)
    .then((retro) => {
      if (!retro) {
        const error: any = new Error("Couldn't find the retro");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ message: "Retro Retrieved.", retro: retro });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

export const getAllUsersInRetro = (req: any, res: any, next: any) => {
  const retroId = req.params.retroId;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error: any = new Error(
      "Validation Failed, entered data is incorrect."
    );
    error.statusCode = 422;
    throw error;
  }

  Retro.find()
    .populate("users")
    .then((result) => {
      if (!result) {
        const error: any = new Error("Found no users!");
        error.statusCode = 404;
        throw error;
      }

      res
        .status(200)
        .json({ message: "Fetched All Users in " + retroId, users: result });
    })
    .catch((err) => console.log(err));
};

export const postUserToRetro = async (req: any, res: any, next: any) => {
  const errors = validationResult(error);

  if (!errors.isEmpty()) {
    const error: any = new Error("");
    error.statusCode = 422;
    throw error;
  }

  const userId: any = req.body.userId;
  const retroId: any = req.body.retroId;

  try {
    const retro = await Retro.findById(retroId);
    const user = await User.findById(userId);
    retro?.users.push(user);

    retro?.save().then((result) => {
      res.status(200).json({ message: "User " + userId + "added to session" });
    });
  } catch (err: any) {
    const error: any = new Error("User couldn't be added to retrospective");
    error.statusCode = 422;
    throw error;
  }
};

export const updateRetroById = (req: any, res: any, next: any) => {
  const retroId = req.params.retroId;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error: any = new Error(
      "Validation Failed, entered data is incorrect!"
    );
    error.statusCode = 422;
    throw error;
  }

  const title = req.body.title;
  const description = req.body.description;
  const users = req.body.users;

  Retro.findById(retroId)
    .then((retro) => {
      if (!retro) {
        const error: any = new Error("Couldn't find the retro");
        error.statusCode = 422;
        throw error;
      }

      User.findById(req.userId).then((user) => {
        if (
          req.userId.toString() !== retro.creatorId.toString() &&
          user?.isAdmin
        ) {
          const error: any = new Error("Not authorized!");
          error.statusCode = 403;
          throw error;
        }
      });

      retro.title = title;
      retro.description = description;
      retro.users = users;

      return retro.save();
    })
    .then((result) => {
      res
        .status(200)
        .json({ message: "Retrospective Updated!", retro: result });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

export const deleteRetroById = (req: any, res: any, next: any) => {
  const retroId = req.params.retroId;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error: any = new Error(
      "Validation failed, entered data is incorrect."
    );
    error.statusCode = 422;
    throw error;
  }

  Retro.findById(retroId)
    .then((retro) => {
      if (!retro) {
        const error: any = new Error("Could not find post");
        error.statusCode = 403;
        throw error;
      }

      return Retro.findByIdAndRemove(retroId);
    })
    .then((result) => {
      return User.findById(req.userId);
    })
    .then((user) => {
      user?.retrospectiveHistory.pull(retroId);
      return user?.save();
    })
    .then((result) => {
      res.status(200).json({ message: "Deleted retrospective" });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

export const discardUserFromRetroById = (req: any, res: any, next: any) => {};
