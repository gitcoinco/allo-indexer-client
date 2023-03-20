type ParamValue = string | number;

type Project = {
  id: number;
  fullId: string;
};

type Round = {
  id: string;
  votesCount: number;
  applicationsStartTime: Date;
};

type ResourceBuilder<T> = (obj: any) => T;

const projectBuilder = (obj: any) => ({
  id: obj.id,
  fullId: obj.fullId,
});

const roundBuilder = (obj: any) => ({
  id: obj.id,
  votesCount: obj.votes,
  applicationsStartTime: new Date(obj.applicationsStartTime * 1000)
});

class AlloIndexerClient {
  public fetch: typeof fetch;
  public baseURI: string;
  public chainId: number;

  public readonly routes: { [name: string]: string } = {
    projects: "/data/:chainId/projects.json",
    rounds: "/data/:chainId/rounds.json",
  };

  constructor(fetchImpl: typeof fetch, baseURI: string, chainId: number) {
    this.fetch = fetchImpl;
    this.baseURI = baseURI;
    this.chainId = chainId;
  }

  projects(): Promise<Project[]> {
    const url = this.buildURL("projects", {
      chainId: this.chainId,
    });

    return this.fetchList(projectBuilder, url);
  }

  rounds(): Promise<Round[]> {
    const url = this.buildURL("rounds", {
      chainId: this.chainId,
    });

    return this.fetchList(roundBuilder, url);
  }

  fetchList<T>(builder: ResourceBuilder<T>, url: string): Promise<T[]> {
    return fetch(url)
      .then(resp => resp.json())
      .then(list => list.map((obj: Array<any>) => builder(obj)));
  }

  buildURL(routeName: string, params: { [key: string]: ParamValue }): string {
    const path = this.compileRoute(this.routes[routeName], params);
    return new URL(path, this.baseURI).toString();
  }

  compileRoute(route: string, params: { [key: string]: ParamValue }): string {
    let slug = route;
    for (const key in params) {
      slug = slug.replace(`:${key}`, params[key].toString());
    }

    return slug;
  }
}

(async () => {
  const c = new AlloIndexerClient(fetch, "http://localhost:4000", 1);
  // const res = await c.projects();
  const res = await c.rounds();
  console.log(res);
})()
