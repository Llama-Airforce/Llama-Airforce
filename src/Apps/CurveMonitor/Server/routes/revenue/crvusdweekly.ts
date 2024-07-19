import type * as ApiTypes from "@CM/Services/Revenue/ApiTypes";

export type Result = Awaited<ReturnType<typeof handler>>;

const handler = defineCachedEventHandler(
  async () => {
    try {
      const res = await $fetch<ApiTypes.GetCrvUsdWeeklyResponse>(
        `https://prices.curve.fi/v1/dao/fees/crvusd/weekly`
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
