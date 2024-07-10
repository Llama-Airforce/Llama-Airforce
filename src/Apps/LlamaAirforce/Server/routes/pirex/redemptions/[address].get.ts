import { isAddress } from "viem";
import type { RuntimeConfig } from "@LAF/nitro.config";

type AlchemyResult = {
  ownedNfts: {
    tokenId: string;
    balance: string;
  }[];
};

export type Result = Awaited<ReturnType<typeof handler>>;

const handler = defineCachedEventHandler(
  async (event) => {
    const config = useRuntimeConfig<RuntimeConfig>(event);
    const { address } = getRouterParams(event);

    if (!isAddress(address)) {
      throw createError({
        statusCode: 400,
        message: "Invalid or missing address parameter",
      });
    }

    try {
      // Fetch data from Alchemy API using native fetch
      const res = await $fetch<AlchemyResult>(
        `https://eth-mainnet.g.alchemy.com/nft/v3/${config.alchemyLAF}/getNFTsForOwner?contractAddresses[]=0x7A3D81CFC5A942aBE9ec656EFF818f7daB4E0Fe1&owner=${address}&withMetadata=false`
      );

      // Return the fetched data
      return res.ownedNfts.map((x) => ({
        tokenId: x.tokenId,
        balance: x.balance,
      }));
    } catch (error) {
      console.error("Error fetching data from Alchemy API:", error);

      throw createError({
        statusCode: 500,
        message: "Error fetching data from Alchemy API",
      });
    }
  },
  { maxAge: 60 }
);

export default handler;
