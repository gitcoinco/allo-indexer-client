import Client from "./client";

(async () => {
  const c = new Client(fetch, "http://localhost:4000", 1);
  const res = await c.getProjects();
  // const res = await c.getProject("projectNumber", 1);
  // const res = await c.getRounds();
  // const res = await c.getRoundVotes("0xD95A1969c41112cEE9A2c931E849bCef36a16F4C");
  console.log(res);
})()
