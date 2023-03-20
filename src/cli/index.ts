import { Client } from "../client";

(async () => {
  const c = new Client(fetch, "http://localhost:4000", 1);
  // const res = await c.getProjects();
  // const res = await c.getProjectBy("projectNumber", 1);
  // const res = await c.getRounds();
  const res = await c.getRoundBy("id", "0x8E420122dE3B3792ABcc69921433a48868bcfAc2");
  // const res = await c.getRoundVotes("0xD95A1969c41112cEE9A2c931E849bCef36a16F4C");
  console.log(res);
})()
