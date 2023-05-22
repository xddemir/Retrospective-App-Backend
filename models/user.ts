import { Schema, model, Model } from "mongoose";

export interface IUser extends Model<Document> {
  name: string;
  email: string;
  required: string;
  password: string;
  isAdmin: boolean;
  currentSessions: any;
  retrospectiveHistory: any;
  madAnswers: any;
  gladAnswers: any;
  sadAnswers: any;
}

export const personelSchema = new Schema<IUser>(
  {
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

    currentSessions: [
      {
        type: Schema.Types.ObjectId,
        ref: "retrospective",
      },
    ],

    madAnswers: [
      {
        type: Schema.Types.ObjectId,
        ref: "answer",
      },
    ],

    gladAnswers: [
      {
        type: Schema.Types.ObjectId,
        ref: "answer",
      },
    ],

    sadAnswers: [
      {
        type: Schema.Types.ObjectId,
        ref: "answer",
      },
    ],

    retrospectiveHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "retrospective",
      },
    ],
  },
  { timestamps: true }
);

const User = model<IUser>("user", personelSchema);
export default User;
