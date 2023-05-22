import { Schema, model } from "mongoose";

export interface IAnswer {
  name: string;
  content: string;
  questionType: string;
  creatorId: Schema.Types.ObjectId;
}

const answersSchema = new Schema<IAnswer>(
  {
    name: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    questionType: {
      type: String,
      required: true,
    },
    creatorId: {
      type: Schema.Types.ObjectId,
      require: true,
    },
  },
  { timestamps: true }
);

const Answer = model<IAnswer>("answer", answersSchema);
export default Answer;
