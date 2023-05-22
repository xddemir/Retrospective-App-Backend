import { validationResult } from "express-validator";
import Retro from "../models/retrospective";
import User from "../models/user";
import { setCache, getCache} from "../services/cache";
import jwt from "jsonwebtoken";

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
    .then(async (user: any) => {
      if (!user?.isAdmin) {
        const error: any = new Error(
          "Only admin users are allowed to create retro."
        );
        error.statusCode = 422;
        throw error;
      }

      creator = user;

      // TODO: key value might be changed in the future development (Dogukan Demir)
      console.log(req.userId);
      await setCache(req.userId, 1500, () => {
        user.currentSessions.push(retro);
        return retro;
      });

      console.log(await getCache(req.userId));

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

export const getUsers = (req: any, res: any, next: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error: any = new Error(
      "Validation Failed, entered data is incorrect."
    );
    error.statusCode = 422;
    throw error;
  }

  getCache(req.userId).then((retro: any) => {
    if (!retro) {
      const error: any = new Error("Active retro not found!");
      error.statusCode = 422;
      throw error;
    }

    res.status(200).json({ users: retro.users });
  });
};

export const getAnswers = (req: any, res: any, next: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error: any = new Error(
      "Validation Failed, entered data is incorrect."
    );
    error.statusCode = 422;
    throw error;
  }

  getCache(req.userId).then((retro: any) => {
    if (!retro) {
      const error: any = new Error("Couldn't find the retro");
      error.statusCode = 422;
      throw error;
    }

    res.status(200).json({ Answers: retro });
  });
};

export const updateRetroById = (req: any, res: any, next: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error: any = new Error(
      "Validation Failed, entered data is incorrect!"
    );
    error.statusCode = 422;
    throw error;
  }

  getCache(req.userId)
    .then(async (retro: any) => {
      if (!retro) {
        const error: any = new Error("Couldn't find the retro");
        error.statusCode = 422;
        throw error;
      }

      if (req.userId.toString() !== retro.creatorId.toString()) {
        const error: any = new Error("User not authorized!");
        error.statusCode = 403;
        throw error;
      }

      return setCache(req.userId, 15, () => {
        retro.title = req.body?.title;
        retro.description = req.body?.description;
        retro.users = req.body?.users;
        retro.madAnswers = req.body?.madAnswers;
        retro.gladAnswers = req.body?.gladAnswers;
        retro.sadAnswers = req.body?.sadAnswers;

        return retro;
      });
    })
    .then((result) => {
      res
        .status(200)
        .json({ message: "Retrospective Updated!", retro: result });
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};

export const addUser = (req: any, res: any, next: any) => {
  const sessionToken: string = req.params.sessionToken;
  console.log("Header: " + sessionToken);

  if (!sessionToken) {
    const error: any = new Error("Token expired or empty");
    error.statusCode = 401;
    throw error;
  }

  let decodedToken: any;

  try {
    decodedToken = jwt.verify(sessionToken, "demirdogukan");
  } catch (error: any) {
    error.statusCode = 500;
    throw error;
  }

  // TODO: Check if user exists then add user to cache (Dogukan Demir)
  let user: any;
  let sessionId = decodedToken.userId;

  User.findById(req.body?.user?._id)
    .then((result: any) => {
      if (!result) {
        const error: any = new Error("Active session couldn't be found!");
        error.statusCode = 403;
        throw error;
      }

      user = result;
      return getCache(sessionId);
    })
    .then((session: any) => {
      if (!session) {
        const error: any = new Error("Active session couldn't be found!");
        error.statusCode = 403;
        throw error;
      }

      session.users.push(user);

      return setCache(sessionId, 15, () => session);
    })
    .then((result: any) => {
      res.status(200).json({
        message: "User Added!",
        user: result,
      });
    })
    .catch((err: any) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
