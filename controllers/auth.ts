import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user";

export function signUp(req: any, res: any, next: any) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error: any = new Error("Validation failed.");
    error.statusCode = 422;
    error.message = errors.array();
    throw error;
  }
  
  const email: string = req.body.email;
  const name: string = req.body.name;
  const password: string = req.body.password;
  const isAdmin: boolean = req.body.isAdmin;

  bcrypt
    .hash(password, 12)
    .then((result: string) => {
      const user = new User({
        name: name,
        email: email,
        password: result,
        isAdmin: isAdmin,
      });
      return user.save();
    })
    .then((result: { _id: any }) => {
      res.status(201).json({ message: "User Created", userId: result._id });
    })
    .catch((err: any) => {
      console.log(err);
    });
}

export function login(req: any, res: any, next: any) {
  const email: string = req.body.email;
  const password: string = req.body.password;
  let loadedUser: any;

  User.findOne({ email: email })
    .then((user: any) => {
      if (!user) {
        const error: any = new Error(
          "A user with this email couldn't be found."
        );
        error.statusCode = 401;
        throw error;
      }

      loadedUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then((isEqual: boolean) => {
      if (!isEqual) {
        const error: any = new Error("Password is Incorrect");
        error.statusCode = 401;
        throw error;
      }

      const token = jwt.sign(
        {
          email: loadedUser.email,
          userId: loadedUser._id.toString(),
        },
        "demirdogukan",
        { expiresIn: "1h" }
      );
      res.status(200).json({ token: token, userId: loadedUser._id.toString() });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
}
