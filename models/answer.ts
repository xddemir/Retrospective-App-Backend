import { Schema, model } from "mongoose";

export enum AnswerTypes {
  MAD = "MAD",
  SAD = "SAD",
  GLAD = "GLAD"
}

export interface IAnswer{
  content: string;
  answerType: keyof typeof AnswerTypes;
  creatorId: Schema.Types.ObjectId;
}

const answerSchema = new Schema<IAnswer>({
  content: {
    type: String,
    required: true,
  },

  answerType: {
    type: String,
    required: true,
  },

  creatorId: {
    type: Schema.Types.ObjectId,
    require: true,
  },
});

const Answer = model<IAnswer>("answer", answerSchema);
export default Answer;
