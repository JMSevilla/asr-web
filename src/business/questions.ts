import { QuestionFormResponse } from '../api/mdp/types';

export const isAnswerYes = (question?: QuestionFormResponse) => question?.answerKey?.toLowerCase() === 'yes';
export const isAnswerNo = (question?: QuestionFormResponse) => question?.answerKey?.toLowerCase() === 'no';
