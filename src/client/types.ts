export type RawObject = {
  // eslint-disable-next-line
  [key: string]: any;
};

export type ResourceBuilder<T> = (obj: RawObject) => T;

export type Project = {
  id: string;
  projectNumber: number;
  title: string;
};

export type Round = {
  id: string;
  votes: number;
  uniqueContributors: number;
  amountUSD: number;
  applicationsStartTime: Date;
};

export type Vote = {
  id: string;
  token: string;
  amount: string;
};

export type Application = {
  id: string;
  projectNumber: number;
  roundId: string;
  status: string;
  payoutAddress: string;
  amountUSD: number;
  votes: number;
  uniqueContributors: number;
};
