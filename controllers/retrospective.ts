import { validationResult } from "express-validator";
import Retro from "../models/retrospective";
import User from "../models/user";
import { setCache, getCache } from "../services/cache";
import jwt from "jsonwebtoken";
import Answer from "../models/answer";
import checkAnswerType from "../utils/util";
import { AnswerTypes } from "../models/answer";

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
      console.log("Session Key: " + req.userId);
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

export const getRetro = (req: any, res: any, next: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error: any = new Error(
      "Validation Failed, entered data is incorrect."
    );
    error.statusCode = 422;
    throw error;
  }

  Retro.findById(req.userId)
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

    res
      .status(200)
      .json({
        MadAnswers: retro.madAnswers,
        GladAnswers: retro.gladAnswers,
        SadAnswers: retro.sadAnswers,
      });
  });
};

export const updateRetro = (req: any, res: any, next: any) => {
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
        .status(201)
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

  let userId = req.body.userId;
  let userEmail = req.body.email;

  console.log(userEmail);

  User.find({email: userEmail})
    .then((result: any) => {
      if (!result) {
        const error: any = new Error("Active user not found!");
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

      return setCache(sessionId, 1500, () => session);
    })
    .then((result: any) => {
      res.status(201).json({
        message: "User Added!",
        sessionId: result.creatorId,
      });
    })
    .catch((err: any) => {
      console.log("Insertion Error: " + err)
      next(err);
    });
};

export const addAnswer = (req: any, res: any, next: any) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    const error: any = new Error(
      "Validation Failed, entered data is incorrect."
    );
    error.statusCode = 422;
    throw error;
  }


  const currentSessionId =  req.body.sessionId;

  if(!currentSessionId){
    const error: any = new Error("Active Retro couldn't be found");
    error.statusCode = 204;
    throw error;
  }

  const answerType =
    checkAnswerType(req.body.answerType) && req.body.answerType.toUpperCase();

  const answer = new Answer({
    content: req.body.content,
    answerType: answerType,
    creatorId: req.userId,
  });

  getCache(currentSessionId)
    .then((retro: any) => {
      if (!retro) {
        const error: any = new Error("Retro couldn't be found");
        error.statusCode = 402;
        throw error;
      }

      return setCache(currentSessionId, 15, () => {
        let user = retro.users.find(
          (user: any) => user._id.toString() == req.userId
        );

        if (answerType === AnswerTypes.GLAD) {
          retro.gladAnswers.push(answer);
          user.gladAnswers.push(answer);
        } else if (answerType === AnswerTypes.SAD) {
          retro.sadAnswers.push(answer);
          user.sadAnswers.push(answer);
        } else if (answerType === AnswerTypes.MAD) {
          retro.madAnswers.push(answer);
          user.madAnswers.push(answer);
        }
      });
    })
    .then((result: any) => {
      res
        .status(201)
        .json({ message: "Answer added", answer: answer, retro: result });
    })
    .catch((err: any) => {
      console.log(err);
      next(err);
    });
};

export const endRetro = (req: any, res: any, next: any) => {

};