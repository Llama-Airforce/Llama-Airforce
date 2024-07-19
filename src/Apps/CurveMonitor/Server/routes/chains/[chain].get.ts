import { isChain } from "@CM/Models/Chain";
import type * as ApiTypes from "@CM/Services/Pools/ApiTypes";

export type Result = Awaited<ReturnType<typeof handler>>;

const handler = defineCachedEventHandler(
  async (event) => {
    const { chain } = getRouterParams(event);

    if (!isChain(chain)) {
      throw createError({
        statusCode: 400,
        message: "Invalid chain",
      });
    }

    try {
      // Fetch data from Alchemy API using native fetch
      const res = await $fetch<ApiTypes.GetPoolsResponse>(
        `https://prices.curve.fi/v1/chains/${chain}?page=1&per_page=9999`
      );

      return res;
    } catch (error) {
      console.error("Error fetching data from Coin Prices API:", error);

      throw createError({
        statusCode: 500,
        message: "Error fetching data from Coin Prices API",
      });
    }
  },
  { maxAge: 300 }
);

export default handler;
