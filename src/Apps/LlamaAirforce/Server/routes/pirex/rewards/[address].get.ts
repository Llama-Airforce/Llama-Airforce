import { type Address, isAddress } from "viem";
import {
  Hono,
  HTTPException,
  type HonoResultOutput,
  cache,
} from "@/Framework/Hono";

type SnapshotReward = {
  address: Address;
  rewardAmount: string;
  rewardIndex: number;
  isClaimed: boolean;
  epoch: number;
};

type FuturesReward = {
  address: Address;
  rewardAmount: string;
  epoch: number;
};

type PirexResponse = {
  snapshotRewards: SnapshotReward[][];
  futuresRewards: FuturesReward[][];
};

const path = "/rewards/:address";

const app = new Hono().get(path, async (c) => {
  const address = c.req.param("address");

  if (!isAddress(address)) {
    throw new HTTPException(400, {
      message: "Invalid or missing address parameter",
    });
  }

  const data = await cache(
    c.req.url,
    async () => {
      try {
        // Fetch data from Pirex API using native fetch
        const res = await fetch(
          `https://pirex.io/api/1/convex/rewards/${address}`
        );
        const data = (await res.json()) as PirexResponse;

        return data;
      } catch (error) {
        console.error("Error fetching data from Pirex API:", error);

        throw new HTTPException(500, {
          message: "Error fetching data from Pirex API",
        });
      }
    },
    { ttl: 1000 * 60 }
  );

  return c.json(data);
});

export type Result = HonoResultOutput<typeof app, typeof path>;
export default app;
