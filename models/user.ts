import mongoose, { Schema, Types, model, Model } from "mongoose";

export interface IUser extends Model<Document> {
  name: string;
  email: string;
  required: string;
  password: string;
  isAdmin: boolean;
  retrospectiveHistory: any;
  questions: any;
}

export const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
  },
  retrospectiveHistory: [
    {
      type: Schema.Types.ObjectId,
      ref: "retrospective",
    },
  ],
  questions: [
    {
      type: Schema.Types.ObjectId,
      ref: "question",
    },
  ],
});

const User = model<IUser>("user", userSchema);
export default User;
