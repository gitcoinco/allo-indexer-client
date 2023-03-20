type RouteParams = {
  [key: string]: string | number;
}

type Project = {
  id: string;
  projectNumber: number;
};

type Round = {
  id: string;
  votesCount: number;
  applicationsStartTime: Date;
};

type Vote = {
  id: string;
  token: string;
  amount: string;
};

type ResourceBuilder<T> = (obj: any) => T;

const projectBuilder = (obj: any): Project => ({
  id: obj.id,
  projectNumber: obj.projectNumber,
});

const roundBuilder = (obj: any): Round => ({
  id: obj.id,
  votesCount: obj.votes,
  applicationsStartTime: new Date(obj.applicationsStartTime * 1000),
});

const voteBuilder = (obj: any): Vote => ({
  id: obj.id,
  token: obj.token,
  amount: obj.amount,
});

abstract class BaseClient {
  public fetch: typeof fetch;
  public baseURI: string;
  public chainId: number;

  protected abstract routes: { [name: string]: string };

  constructor(fetchImpl: typeof fetch, baseURI: string, chainId: number) {
    this.fetch = fetchImpl;
    this.baseURI = baseURI;
    this.chainId = chainId;
  }

  protected fetchResources<T>(routeName: string, params: RouteParams, builder: ResourceBuilder<T>): Promise<T[]> {
    const url = this.buildURL(routeName, params);
    return fetch(url)
      .then(resp => resp.json())
      .then(list => list.map((obj: Array<any>) => builder(obj)));
  }

  protected fetchResourceFromList<T>(routeName: string, params: RouteParams, builder: ResourceBuilder<T>, key: keyof T, value: any): Promise<T | undefined> {
    return this.fetchResources(routeName, params, builder)
      .then((list: T[]) => list.find((r: T) => r[key] === value));
  }

  protected buildURL(routeName: string, params: RouteParams): string {
    const path = this.compileRoute(this.routes[routeName], {
      ...params,
      chainId: this.chainId,
    });

    return new URL(path, this.baseURI).toString();
  }

  protected compileRoute(route: string, params: RouteParams): string {
    let slug = route;
    for (const key in params) {
      slug = slug.replace(`:${key}`, params[key].toString());
    }

    return slug;
  }
}

class AlloIndexerClient extends BaseClient {
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

(async () => {
  const c = new AlloIndexerClient(fetch, "http://localhost:4000", 1);
  const res = await c.getProjects();
  // const res = await c.getProject("projectNumber", 1);
  // const res = await c.getRounds();
  // const res = await c.getRoundVotes("0xD95A1969c41112cEE9A2c931E849bCef36a16F4C");
  console.log(res);
})()
