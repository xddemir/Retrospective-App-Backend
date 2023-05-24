import { AnswerTypes } from "../models/question";

export default function checkAnswerType(answer: String) {
  return Object.values(AnswerTypes).includes(
    answer.toUpperCase() as AnswerTypes
  );
}
