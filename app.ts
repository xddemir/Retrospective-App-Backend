import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import retrosRouter from "./routes/retrospective";
import authRouter from "./routes/auth";
import inviteRouter from "./routes/invite";
import userRouter from "./routes/user";


const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", 
                "Content-Type, Authorization");
  next();
});

app.use("/auth", authRouter)
app.use("/retrospectives", retrosRouter)
app.use("/user", userRouter)
app.use("/invite-user", inviteRouter)

mongoose
  .connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.CLUSTER}test`)
  .then((res) => {
    console.log("Connection Succeeded");
    app.listen(process.env.PORT);
  })
  .catch((err) => console.log(err));
