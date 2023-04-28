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
  matchAmount: string;
  matchAmountUSD: number;
  amountUSD: number;
  applicationsStartTime: Date;
  applicationsEndTime: Date;
  roundStartTime: Date;
  roundEndTime: Date;
};

export type Vote = {
  id: string;
  projectId: string;
  roundId: string;
  token: string;
  voter: string;
  grantAddress: string;
  amount: string;
  amountUSD: number;
};

export type Application = {
  id: string;
  projectId: string;
  roundId: string;
  status: string;
  payoutAddress: string;
  amountUSD: number;
  votes: number;
  uniqueContributors: number;
};

export type Match = {
  totalReceived: number;
  sumOfSqrt: number;
  matched: number;
  contributionsCount: number;
  projectId: string;
  applicationId: string;
  projectName: string;
  payoutAddress: string;
};
