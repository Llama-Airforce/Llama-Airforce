import { isAddress } from "viem";
import {
  Hono,
  HTTPException,
  type HonoResultOutput,
  cache,
} from "@/Framework/Hono";
import { env } from "@LAF/Server/helpers/env";

type AlchemyResult = {
  ownedNfts: {
    tokenId: string;
    balance: string;
  }[];
};

const path = "/futures/:address";

const app = new Hono().get(path, async (c) => {
  const address = c.req.param("address");
  const { alchemyLAF } = env();

  if (!isAddress(address)) {
    throw new HTTPException(400, {
      message: "Invalid or missing address parameter",
    });
  }

  const data = await cache(
    c.req.url,
    async () => {
      try {
        // Fetch data from Alchemy API using native fetch
        const res = await fetch(
          `https://eth-mainnet.g.alchemy.com/nft/v3/${alchemyLAF}/getNFTsForOwner?contractAddresses[]=0xc044613b702ed11567a38108703ac5478a3f7db8&owner=${address}&withMetadata=false`
        );
        const data = (await res.json()) as AlchemyResult;

        return data.ownedNfts.map((x) => ({
          tokenId: x.tokenId,
          balance: x.balance,
        }));
      } catch (error) {
        console.error("Error fetching data from Alchemy API:", error);

        throw new HTTPException(500, {
          message: "Error fetching data from Alchemy API",
        });
      }
    },
    { ttl: 1000 * 60 }
  );

  return c.json(data);
});

export type Result = HonoResultOutput<typeof app, typeof path>;
export default app;
