import { Client, ResourceFetchError } from "../client";
import { parseArgs } from "util";

const baseURI = "https://grants-stack-indexer.fly.dev/";
const chainId = 1;
const client = new Client(fetch, baseURI, chainId);

const logError = (err: Error) => {
  switch (err.name) {
    case "ResourceFetchError":
      const e = err as ResourceFetchError;
      console.error(
        "resource fetch error:",
        `${e.status} - ${e.statusText}.`,
        err.message
      );
      break;
    default:
      console.error("unexpected error:", err.name, err.message);
  }
};

const projectsCommand = (_args: { [key: string]: string }) =>
  client
    .getProjects()
    .then((projects) => projects.forEach((p) => console.log(p)))
    .catch(logError);

const roundsCommand = (_args: { [key: string]: string }) =>
  client
    .getRounds()
    .then((rounds) => rounds.forEach((r) => console.log(r)))
    .catch(logError);

const projectCommand = (_args: { [key: string]: string }) =>
  client
    .getProjectBy("projectNumber", Number(_args.projectNumber))
    .then((project) => console.log(project))
    .catch(logError);

const votesCommand = (_args: { [key: string]: string }) =>
  client
    .getVotes(_args.roundId, _args.projectId)
    .then((votes) => votes.forEach((v) => console.log(v)))
    .catch(logError);


const commands: any = {
  projects: {
    options: {},
    handler: projectsCommand,
  },

  rounds: {
    options: {},
    handler: roundsCommand,
  },

  project: {
    options: {
      projectNumber: {
        type: "string",
        short: "p",
      },
    },
    handler: projectCommand,
  },

  votes: {
    options: {
      roundId: {
        type: "string",
        short: "r",
      },
      projectId: {
        type: "string",
        short: "p",
      },
    },
    handler: votesCommand,
  }
};

const cmdName = process.argv[2];
const flags = process.argv.slice(3);

const cmd = commands[cmdName];
if (cmd === undefined) {
  console.error("command not found:", cmdName);
  process.exit(1);
}

const { values } = parseArgs({
  args: flags,
  options: cmd.options,
});

await cmd.handler(values);

// (async () => {
//   // const c = new Client(fetch, "http://localhost:4000", 1);
//   const c = new Client(fetch, "https://grants-stack-indexer.fly.dev/", 1);
//   // const res = await c.getProjects();
//   // const res = await c.getProjectBy("projectNumber", 1);
//   // const res = await c.getRounds();
//   // const res = await c.getRoundBy("id", "0x8E420122dE3B3792ABcc69921433a48868bcfAc2");
//   // const res = await c.getRoundApplications("0xD95A1969c41112cEE9A2c931E849bCef36a16F4C");
//   const res = await c.getRoundApplicationBy("0xD95A1969c41112cEE9A2c931E849bCef36a16F4C", "id", "0xc290dd8e51ac35480d9872ce4484aac23bb812c47c0567bfd4beb9113726ed11");
//   // const res = await c.getVotesBy("0xe575282b376E3c9886779A841A2510F1Dd8C2CE4");
//   console.log(res);
// })()
