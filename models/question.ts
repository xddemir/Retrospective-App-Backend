import { Schema, model } from "mongoose";

export interface IQuestion {
  name: string;
  content: string;
  questionType: string;
  answer: string;
  creatorId: Schema.Types.ObjectId;
}

const questionSchema = new Schema<IQuestion>({
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

  answer: [
    {
      type: String,
      required: true,
    },
  ],

  creatorId: {
    type: Schema.Types.ObjectId,
    require: true,
  },
});

const Question = model<IQuestion>("question", questionSchema);
export default Question;
