import { isAddress } from "viem";
import {
  Hono,
  HTTPException,
  type HonoResultOutput,
  cache,
} from "@/Framework/Hono";
import { DefiLlamaService } from "@/Services";

const path = "/:addresses";

const app = new Hono().get(path, async (c) => {
  const addressParam = c.req.param("addresses");
  if (!addressParam) {
    throw new HTTPException(400, { message: "Missing addresses parameter" });
  }

  const isValidAddress = (address: string): boolean => isAddress(address);
  const addresses = addressParam.split(",");
  const invalidAddress = addresses.find((address) => !isValidAddress(address));
  if (invalidAddress) {
    throw new HTTPException(400, {
      message: `Invalid address: ${invalidAddress}`,
    });
  }

  const llamaService = new DefiLlamaService();

  const data = await cache(
    c.req.url,
    async () => {
      try {
        const data = await llamaService.getPrices(addresses);

        return data;
      } catch (error) {
        console.error("Error fetching data from DefiLlama API:", error);

        throw new HTTPException(500, {
          message: "Error fetching data from DefiLlama API",
        });
      }
    },
    { ttl: 5000 * 60 }
  );

  return c.json(data);
});

export type Result = HonoResultOutput<typeof app, typeof path>;
export default app;
