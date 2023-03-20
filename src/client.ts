import BaseClient from "./baseClient";
import {
  projectBuilder,
  roundBuilder,
  voteBuilder,
} from "./builders";
import {
  Project,
  Round,
  Vote,
} from "./types";

class Client extends BaseClient {
  protected routes: { [name: string]: string } = {
    projects: "/data/:chainId/projects.json",
    rounds: "/data/:chainId/rounds.json",
    roundVotes: "/data/:chainId/rounds/:roundId/votes.json",
  };

  constructor(fetchImpl: typeof fetch, baseURI: string, chainId: number) {
    super(fetchImpl, baseURI, chainId);
  }

  getProjects(): Promise<Project[]> {
    return this.fetchResources("projects", {}, projectBuilder);
  }

  getProject(key: keyof Project, value: any): Promise<Project | undefined> {
    return this.fetchResourceFromList("projects", {}, projectBuilder, key, value);
  }

  getRounds(): Promise<Round[]> {
    return this.fetchResources("rounds", {}, roundBuilder);
  }

  getRoundVotes(roundId: string): Promise<Vote[]> {
    return this.fetchResources("roundVotes", { roundId }, voteBuilder);
  }
}

export default Client;
