import { Hono, HTTPException, type HonoResultOutput } from "@/Framework/Hono";
import type { Delegation } from "@LAF/Pages/Bribes/Rounds/Services/SnapshotService";
import { env } from "@LAF/Server/helpers/env";

type Body = {
  block: number;
  timestampLast: number;
  spaceIn: string;
  delegateIn: string;
  delegatorIn: string;
  offset: number;
};

type SubgraphResult = {
  data: {
    delegations: Delegation[];
  };
};

const path = "/";

const app = new Hono().post(path, async (c) => {
  const { subgraphKey } = env();

  let body: Body;
  try {
    body = await c.req.json<Body>();
  } catch {
    throw new HTTPException(400, {
      message: "Missing or invalid request body",
    });
  }

  const query = `{
    delegations (
      where: {
        timestamp_gte: ${body.timestampLast}
        ${body.spaceIn}
        ${body.delegateIn}
        ${body.delegatorIn}
      },
      first: ${body.offset}
      block: {
        number: ${body.block}
      }
      orderBy: timestamp
      orderDirection: asc
    ) {
        id
        timestamp
        delegate
        delegator
        space
    } }`;

  try {
    // Fetch data from Subgraph using native fetch
    const url = `https://gateway.thegraph.com/api/${subgraphKey}/subgraphs/id/5MkoYVE5KREBTe2x45FuPdqWKGc2JgrHDteMzi6irSGD`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });
    const data = (await res.json()) as SubgraphResult;

    return c.json(data);
  } catch (error) {
    console.error("Error fetching data from Subgraph:", error);

    throw new HTTPException(500, {
      message: "Error fetching data from Subgraph",
    });
  }
});

export type Result = HonoResultOutput<typeof app, typeof path>;
export default app;
