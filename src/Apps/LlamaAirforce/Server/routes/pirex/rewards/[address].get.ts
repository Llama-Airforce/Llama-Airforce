import { createError, getRouterParams } from "h3";
import { defineCachedEventHandler } from "nitropack/runtime";
import { isAddress } from "viem";

export default defineCachedEventHandler(
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
      const res = await $fetch(
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
  { maxAge: 60 * 60 }
);
