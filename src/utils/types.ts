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

export type { CardUpdateParams, CardRemoveParams, CardInfo };
