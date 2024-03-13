import { Classroom, ClassCode } from "@prisma/client";

interface TermDefPair {
  term: string;
  def: string;
}

interface CardInfo {
  term: string;
  def: string;
  id: string;
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

export type { CardUpdateParams, CardRemoveParams, CardInfo, AddClassRes };
