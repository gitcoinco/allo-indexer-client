import { RawObject, ResourceBuilder } from "./types.js";
import { ResourceFetchError } from "./errors.js";

type RouteParams = {
  [key: string]: string;
};

export type QueryParams = {
  [key: string]: string;
};

export type RequestParams = {
  query: QueryParams;
  body: {
    [key: string]: string | Blob;
  };
};

type RequestMethod = "GET" | "POST";

abstract class BaseClient {
  public fetch: typeof fetch;
  public baseURI: string;
  public chainId: number;

  protected abstract routes: { [name: string]: string };

  /** MAKE SURE TO DO fetch.bind(window) WHEN PASSING IN FETCH IMPLEMENTATION */
  constructor(fetchImpl: typeof fetch, baseURI: string, chainId: number) {
    this.fetch = fetchImpl;
    this.baseURI = baseURI;
    this.chainId = chainId;
  }

  protected async fetchResources<T>(
    routeName: string,
    routeParams: RouteParams,
    builder: ResourceBuilder<T>,
    params?: RequestParams,
    method: RequestMethod = "GET",
  ): Promise<T[]> {
    const fetchOptions: RequestInit = { method };

    if (params !== undefined && Object.keys(params.body).length > 0) {
      const body = new FormData();
      for (const key in params.body) {
        const value = params.body[key];
        if (value !== undefined) {
          body.set(key, value);
        }
      }

      fetchOptions.body = body;
    }

    const url = this.buildURL(routeName, routeParams, params?.query ?? {});
    const resp = await this.fetch(url, fetchOptions);

    if (!resp.ok) {
      let serverErrorMessage = undefined;

      try {
        serverErrorMessage = await resp.json();
      } catch (e) {
        // ignore if not json
      }

      throw new ResourceFetchError(
        resp.status,
        resp.statusText,
        serverErrorMessage?.error ??
          `cannot fetch resource at route "${routeName}"`,
      );
    }

    const list = await resp.json();

    return list.map((obj: Array<RawObject>) => builder(obj));
  }

  protected async fetchResourcesFromList<T>(
    routeName: string,
    routeParams: RouteParams,
    builder: ResourceBuilder<T>,
    key: keyof T,
    value: string | number,
    caseSensitive = false,
    params?: RequestParams,
    method: RequestMethod = "GET",
  ): Promise<T[]> {
    return this.fetchResources(
      routeName,
      routeParams,
      builder,
      params,
      method,
    ).then((list: T[]) => {
      const f = (r: T) => {
        const actualValue = r[key];
        if (caseSensitive && typeof actualValue === "string") {
          return actualValue.toLowerCase() === value.toString().toLowerCase();
        }

        return actualValue === value;
      };

      return list.filter(f);
    });
  }

  protected async fetchResourceFromList<T>(
    routeName: string,
    params: RouteParams,
    builder: ResourceBuilder<T>,
    key: keyof T,
    value: string | number,
    caseSensitive = false,
  ): Promise<T | undefined> {
    return this.fetchResourcesFromList(
      routeName,
      params,
      builder,
      key,
      value,
      caseSensitive,
    ).then((list: T[]) => {
      return list[0];
    });
  }

  protected buildURL(
    routeName: string,
    routeParams: RouteParams,
    queryParams: QueryParams,
  ): string {
    const path = this.compileRoute(this.routes[routeName], {
      ...routeParams,
      chainId: String(this.chainId),
    });

    const url = new URL(path, this.baseURI);

    if (Object.keys(queryParams).length > 0) {
      const sp = new URLSearchParams();
      for (const k in queryParams) {
        sp.append(k, queryParams[k]);
      }

      url.search = sp.toString();
    }

    return url.toString();
  }

  protected compileRoute(route: string, params: RouteParams): string {
    let slug = route;
    for (const key in params) {
      slug = slug.replace(`:${key}`, params[key].toString());
    }

    return slug;
  }
}

export default BaseClient;
