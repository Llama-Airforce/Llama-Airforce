import { createError, getRouterParams } from "h3";
import { defineCachedEventHandler } from "nitropack/runtime";
import { type Address, isAddress } from "viem";

type SnapshotReward = {
  address: Address;
  rewardAmount: string;
  rewardIndex: number;
  isClaimed: boolean;
  epoch: number;
};

type PirexResponse = {
  snapshotRewards: SnapshotReward[][];
};

export type Result = Awaited<ReturnType<typeof handler>>;

const handler = defineCachedEventHandler(
  async (event) => {
    // Get the address from the route parameter
    const { address } = getRouterParams(event);

    if (!isAddress(address)) {
      throw createError({
        statusCode: 400,
        message: "Invalid or missing address parameter",
      });
    }

    try {
      // Fetch data from Pirex API using native fetch
      const res = await $fetch<PirexResponse>(
        `https://pirex.io/api/1/convex/rewards/${address}`
      );

      // Return the fetched data
      return res;
    } catch (error) {
      console.error("Error fetching data from Pirex API:", error);

      throw createError({
        statusCode: 500,
        message: "Error fetching data from Pirex API",
      });
    }
  },
  { maxAge: 60 }
);

export default handler;
