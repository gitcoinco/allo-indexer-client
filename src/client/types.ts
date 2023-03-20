export type ResourceBuilder<T> = (obj: any) => T;

export type Project = {
  id: string;
  projectNumber: number;
};

export type Round = {
  id: string;
  votesCount: number;
  applicationsStartTime: Date;
};

export type Vote = {
  id: string;
  token: string;
  amount: string;
};

export type Application = Project & {
  id: string;
  projectNumber: number;
  roundId: string;
  status: string;
  payoutAddress: string;
  amountUSD: number;
  votes: number;
  uniqueContributors: number;
};
