import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import retrosRouter from "./routes/retros";
import authRouter from "./routes/auth";


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
app.use("/retros", retrosRouter)

mongoose
  .connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.jirq26m.mongodb.net/test`)
  .then((res) => {
    console.log("Connection Succeeded");
    app.listen(process.env.PORT);
  })
  .catch((err) => console.log(err));
