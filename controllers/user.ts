import { validationResult } from "express-validator";
import User from "../models/user";
import bcrypt from 'bcryptjs';

export const getUserById = (req: any, res: any, next: any) => {
  const userId = req.params.userId;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error: any = new Error(
      "Validation Failed, entered data is incorrect."
    );
    error.statusCode = 422;
    throw error;
  }

  User.findById(userId)
    .then((user) => {
      if (!user) {
        const error: any = new Error("User not found!");
        error.statusCode = 422;
        throw error;
      }

      res.status(200).json({ user: user });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

export const getAllQuestionsByUserId = (req: any, res: any, next: any) => {
  const userId = req.params.userId;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error: any = new Error(
      "Validation Failed, entered data is incorrect."
    );
    error.statusCode = 422;
    throw error;
  }

  User.findById(userId)
    .then((user) => {
      if (!user) {
        const error: any = new Error("User not found!");
        error.statusCode = 422;
        throw error;
      }

      return user.populate("questions");
    })
    .then((questions) => {
      if (!questions) {
        const error: any = new Error("Questions not found!");
        error.statusCode = 422;
        throw error;
      }

      res.status(200).json({ questions: questions });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

export const getAllRetrospectiveHistory = (req: any, res: any, next: any) => {
  const userId = req.params.userId;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error: any = new Error(
      "Validation Failed, entered data is incorrect."
    );
    error.statusCode = 422;
    throw error;
  }

  User.findById(userId)
    .then((user) => {
      if (!user) {
        const error: any = new Error("User not found!");
        error.statusCode = 422;
        throw error;
      }

      return user.populate("retrospectiveHistory");
    })
    .then((retroHistory) => {
      if (!retroHistory) {
        const error: any = new Error("Empty Retrospective History!");
        error.statusCode = 422;
        throw error;
      }

      res.status(200).json({ retroHistory: retroHistory });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

export const updateUser = (req: any, res: any, next: any) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    const error: any = new Error("Not authorized");
    error.statusCode = 500;
    throw error;
  }

  const name: string = req.body?.name;
  const email: string = req.body?.email;
  const password: string = req.body?.password;
  const isAdmin: boolean = req.body?.isAdmin;

  User.findById(req.userId)
    .then(async (user: any)=> {
      if (!user) {
        const error: any = new Error("User not found!");
        error.statusCode = 422;
        throw error;
      }

      user.name = name;
      user.email = email;
      user.isAdmin = isAdmin;
      user.password = await bcrypt.hash(password, 12)

      return user.save();
    })
    .then((result: any) => {
      res
        .status(200)
        .json({ message: "User updated successfully.", user: result });
    })
    .catch((err: any) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

export const getRetroById = (req: any, res: any, next: any) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    const error: any = new Error("Not authorized");
    error.statusCode = 500;
    throw error;
  }

  const userId = req.params.userId;

  User.findById(userId)
    .then((user: any) => {
      if (!user) {
        const error: any = new Error("User not found!");
        error.statusCode = 422;
        throw error;
      }

      res.status(200).json({ user: user });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
