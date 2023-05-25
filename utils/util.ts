import { AnswerTypes } from "../models/answer";

export default function checkAnswerType(answer: String) {
  return Object.values(AnswerTypes).includes(
    answer.toUpperCase() as AnswerTypes
  );
}
