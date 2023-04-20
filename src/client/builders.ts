import {
  RawObject,
  ResourceBuilder,
  Project,
  Round,
  Application,
  Vote,
  Match,
} from "./types.js";

export const projectBuilder: ResourceBuilder<Project> = (
  obj: RawObject
): Project => ({
  id: obj.id,
  projectNumber: obj.projectNumber,
  title: obj.metadata?.title ?? "",
});

export const roundBuilder: ResourceBuilder<Round> = (
  obj: RawObject
): Round => ({
  id: obj.id,
  votes: obj.votes,
  uniqueContributors: obj.uniqueContributors,
  amountUSD: obj.amountUSD,
  applicationsStartTime: new Date(obj.applicationsStartTime * 1000),
  matchAmount: obj.matchAmount,
  matchAmountUSD: obj.matchAmountUSD,
});

export const voteBuilder: ResourceBuilder<Vote> = (obj: RawObject): Vote => ({
  id: obj.id,
  projectId: obj.projectId,
  roundId: obj.roundId,
  token: obj.token,
  voter: obj.voter,
  grantAddress: obj.grantAddress,
  amount: obj.amount,
  amountUSD: obj.amountUSD,
});

export const roundApplicationBuilder: ResourceBuilder<Application> = (
  obj: RawObject
): Application => ({
  id: obj.id,
  projectNumber: obj.projectNumber,
  roundId: obj.roundId,
  status: obj.status,
  payoutAddress: obj.payoutAddress,
  amountUSD: obj.amountUSD,
  votes: obj.votes,
  uniqueContributors: obj.uniqueContributors,
});

export const roundMatchBuilder: ResourceBuilder<Match> = (
  obj: RawObject
): Match => ({
  totalReceived: obj.totalReceived,
  sumOfSqrt: obj.sumOfSqrt,
  matched: obj.matched,
  projectName: obj.projectName,
  payoutAddress: obj.payoutAddress,
  contributorsCount: obj.contributorsCount,
  projectId: obj.projectId,
  applicationId: obj.applicationId,
});
