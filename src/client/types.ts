// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type RawObject = Record<string, any>;

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
  token: string;
  matchAmount: bigint;
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
  applicationId: string;
  token: string;
  voter: string;
  grantAddress: string;
  amount: string;
  amountUSD: number;
  transaction: string;
};

export type DetailedVote = Vote & {
  roundName: string;
  projectTitle: string;
  roundStartTime: number;
  roundEndTime: number;
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
  totalReceived: bigint;
  sumOfSqrt: bigint;
  matched: bigint;
  matchedUSD: number;
  contributionsCount: number;
  projectId: string;
  applicationId: string;
  projectName: string;
  payoutAddress: string;
};

export type PassportScore = {
  address: string;
  score: string;
  status: string;
  last_score_timestamp: string;
  evidence: Evidence;
  error: unknown;
};

export type Evidence = {
  type: string;
  success: boolean;
  rawScore: string;
  threshold: string;
};
