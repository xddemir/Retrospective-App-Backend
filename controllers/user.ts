import { validationResult } from "express-validator";
import User from "../models/user";

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

}

export const updateUser = (req: any, res: any, next: any) => {

}

export const getRetroById = (req: any, res: any, next: any) => {
  
}
