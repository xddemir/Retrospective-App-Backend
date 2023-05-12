import { Schema, Types, model, Collection } from "mongoose";

export interface IRetro extends Collection {
  title: string;
  description: string;
  users: any;
  date: string;
  creatorId: Schema.Types.ObjectId;
  questions: Schema.Types.ObjectId;
}

const retroSchema = new Schema<IRetro>({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  users: [
    {
      type: Schema.Types.ObjectId,
    },
  ],
  date: {
    type: String,
    required: true,
  },
  creatorId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  questions: {
    type: Schema.Types.ObjectId,
    ref: "question",
  },
});

const Retro = model<IRetro>("retrospective", retroSchema);
export default Retro;
