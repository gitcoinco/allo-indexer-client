import {
  RawObject,
  ResourceBuilder,
  Project,
  Round,
  Application,
  Vote,
  Match,
  PassportScore,
  DetailedVote,
} from "./types.js";

export const projectBuilder: ResourceBuilder<Project> = (
  obj: RawObject,
): Project => ({
  id: obj.id,
  projectNumber: obj.projectNumber,
  title: obj.metadata?.title ?? "",
});

export const roundBuilder: ResourceBuilder<Round> = (
  obj: RawObject,
): Round => ({
  id: obj.id,
  votes: obj.votes,
  uniqueContributors: obj.uniqueContributors,
  amountUSD: obj.amountUSD,
  token: obj.token,
  matchAmount: BigInt(obj.matchAmount),
  matchAmountUSD: obj.matchAmountUSD,
  applicationsStartTime: new Date(obj.applicationsStartTime * 1000),
  applicationsEndTime: new Date(obj.applicationsEndTime * 1000),
  roundStartTime: new Date(obj.roundStartTime * 1000),
  roundEndTime: new Date(obj.roundEndTime * 1000),
});

export const voteBuilder: ResourceBuilder<Vote> = (obj: RawObject): Vote => ({
  id: obj.id,
  projectId: obj.projectId,
  roundId: obj.roundId,
  applicationId: obj.application,
  token: obj.token,
  voter: obj.voter,
  grantAddress: obj.grantAddress,
  amount: obj.amount,
  amountUSD: obj.amountUSD,
  transaction: obj.transaction,
});

export const detailedVoteBuilder: ResourceBuilder<DetailedVote> = (
  obj: RawObject,
): DetailedVote => ({
  ...voteBuilder(obj),
  roundName: obj.roundName,
  projectTitle: obj.projectTitle,
  roundStartTime: obj.roundStartTime,
  roundEndTime: obj.roundEndTime,
});

export const roundApplicationBuilder: ResourceBuilder<Application> = (
  obj: RawObject,
): Application => ({
  id: obj.id,
  projectId: obj.projectId,
  roundId: obj.roundId,
  status: obj.status,
  payoutAddress: obj.payoutAddress,
  amountUSD: obj.amountUSD,
  votes: obj.votes,
  uniqueContributors: obj.uniqueContributors,
});

export const roundMatchBuilder: ResourceBuilder<Match> = (
  obj: RawObject,
): Match => ({
  totalReceived: BigInt(obj.totalReceived),
  sumOfSqrt: BigInt(obj.sumOfSqrt),
  matched: BigInt(obj.matched),
  matchedUSD: obj.matchedUSD,
  projectName: obj.projectName,
  payoutAddress: obj.payoutAddress,
  contributionsCount: obj.contributionsCount,
  projectId: obj.projectId,
  applicationId: obj.applicationId,
});

export const passportScoreBuilder: ResourceBuilder<PassportScore> = (
  obj: RawObject,
): PassportScore => {
  return obj as PassportScore;
};
