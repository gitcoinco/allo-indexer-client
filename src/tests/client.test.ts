import { Client } from "../client";
import * as fs from "fs";
import * as path from "path";

const baseDataURI = "https://test.dev";
const chainId = 0;

const loadFixture = (name: string) => {
  const p = path.resolve(__dirname, "fixtures", `${name}.json`);
  return fs.readFileSync(p, { encoding: "utf8", flag: "r" });
};

const mockFetch = (status: number, fixture: string) => {
  const body = loadFixture(fixture);
  const responseMock = new Response(body, { status });
  return jest.fn(() => Promise.resolve(responseMock));
};

describe("Client", () => {
  describe("getProjects", () => {
    test("returns projects", async () => {
      const c = new Client(mockFetch(200, "projects"), baseDataURI, chainId);
      const projects = await c.getProjects();
      expect(projects.length).toEqual(3);

      const expectedProjects = [
        {
          id: "0xA0000000000000000000000000000000000000000000000000000000000001",
          projectNumber: 1,
          title: "Project 1",
        },
        {
          id: "0xA0000000000000000000000000000000000000000000000000000000000002",
          projectNumber: 2,
          title: "Project 2",
        },
        {
          id: "0xA0000000000000000000000000000000000000000000000000000000000003",
          projectNumber: 2,
          title:
            "Project 3 (same projectNumber from another registry, so the id is different)",
        },
      ];

      expect(projects).toEqual(expectedProjects);
    });

    test("throws error for HTTP status code outside 200..299", async () => {
      const c = new Client(mockFetch(404, "projects"), baseDataURI, chainId);
      await expect(c.getProjects()).rejects.toThrow(
        `cannot fetch resource at route "projects"`
      );
    });
  });

  describe("getProjectBy", () => {
    test("returns project by id", async () => {
      const c = new Client(mockFetch(200, "projects"), baseDataURI, chainId);
      const project = await c.getProjectById(
        "0xA0000000000000000000000000000000000000000000000000000000000001"
      );

      const expectedProject = {
        id: "0xA0000000000000000000000000000000000000000000000000000000000001",
        projectNumber: 1,
        title: "Project 1",
      };

      expect(project).toEqual(expectedProject);
    });

    test("returns undefined with bad case sensitive value", async () => {
      const c = new Client(mockFetch(200, "projects"), baseDataURI, chainId);
      const project = await c.getProjectBy(
        "id",
        "0xa0000000000000000000000000000000000000000000000000000000000001"
      );

      expect(project).toEqual(undefined);
    });

    test("returns project by id case insensitive", async () => {
      const c = new Client(mockFetch(200, "projects"), baseDataURI, chainId);
      const project = await c.getProjectById(
        "0xa0000000000000000000000000000000000000000000000000000000000001"
      );

      const expectedProject = {
        id: "0xA0000000000000000000000000000000000000000000000000000000000001",
        projectNumber: 1,
        title: "Project 1",
      };

      expect(project).toEqual(expectedProject);
    });
  });

  describe("getProjectsBy", () => {
    test("returns a list of projects by projectNumber", async () => {
      const c = new Client(mockFetch(200, "projects"), baseDataURI, chainId);
      const projects = await c.getProjectsBy("projectNumber", 2);

      expect(projects.length).toEqual(2);

      expect(projects[0].id).toEqual(
        "0xA0000000000000000000000000000000000000000000000000000000000002"
      );
      expect(projects[0].projectNumber).toEqual(2);
      expect(projects[0].title).toEqual("Project 2");

      expect(projects[1].id).toEqual(
        "0xA0000000000000000000000000000000000000000000000000000000000003"
      );
      expect(projects[1].projectNumber).toEqual(2);
      expect(projects[1].title).toEqual(
        "Project 3 (same projectNumber from another registry, so the id is different)"
      );
    });
  });

  describe("getProjectById", () => {
    test("returns project by id", async () => {
      const c = new Client(mockFetch(200, "projects"), baseDataURI, chainId);
      const project = await c.getProjectById(
        "0xA0000000000000000000000000000000000000000000000000000000000001"
      );

      const expectedProject = {
        id: "0xA0000000000000000000000000000000000000000000000000000000000001",
        projectNumber: 1,
        title: "Project 1",
      };

      expect(project).toEqual(expectedProject);
    });

    test("returns project by id case insensitive", async () => {
      const c = new Client(mockFetch(200, "projects"), baseDataURI, chainId);
      const project = await c.getProjectById(
        "0xa0000000000000000000000000000000000000000000000000000000000001"
      );

      const expectedProject = {
        id: "0xA0000000000000000000000000000000000000000000000000000000000001",
        projectNumber: 1,
        title: "Project 1",
      };

      expect(project).toEqual(expectedProject);
    });
  });

  describe("getVotes", () => {
    test("returns project votes with project id", async () => {
      const c = new Client(
        mockFetch(200, "projectVotes"),
        baseDataURI,
        chainId
      );
      const votes = await c.getVotes(
        "0xA000000000000000000000000000000000000000",
        "0xA000000000000000000000000000000000000000000000000000000000000"
      );
      expect(votes.length).toEqual(2);
    });

    test("returns round votes with round id", async () => {
      const c = new Client(mockFetch(200, "roundVotes"), baseDataURI, chainId);
      const votes = await c.getVotes(
        "0xA000000000000000000000000000000000000000"
      );
      expect(votes.length).toEqual(4);
    });
  });

  describe("getPassportScores", () => {
    test("returns passport scores", async () => {
      const c = new Client(
        mockFetch(200, "passportScores"),
        baseDataURI,
        chainId
      );
      const scores = await c.getPassportScores();
      expect(scores.length).toEqual(4);
    });
  });
});
