import { Classroom, ClassCode, SetType } from "@prisma/client";

interface TermDefPair {
  term: string;
  def: string;
}

interface CardInfo {
  term: string;
  def: string;
  id: string;
  type: SetType;
}

export type { TermDefPair };

interface CardUpdateParams {
  id: number;
  term: string;
  def: string;
}

interface CardRemoveParams {
  id: number;
}

interface AddClassRes {
  class: Classroom;
  classCode: ClassCode;
}

interface SetConfig {
  readingComprehensionLevel: string;
  setType: SetType;
  pomodoro: string;
  pomodoroTimer: string;
  pomodoroCards: string;
}

export type {
  CardUpdateParams,
  CardRemoveParams,
  CardInfo,
  AddClassRes,
  SetConfig,
};
