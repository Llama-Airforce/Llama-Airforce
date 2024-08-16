import {
  Hono,
  HTTPException,
  type HonoResultOutput,
  cache,
} from "@/Framework/Hono";
import "@/Util/llamadash";
import { isPlatform, isProtocol } from "@LAF/Pages/Bribes/Models";
import { useCosmosDb } from "@LAF/Server/util/useCosmosDb";

const path = "/:platform/:protocol/rounds";

const app = new Hono().get(path, async (c) => {
  const platform = c.req.param("platform");
  const protocol = c.req.param("protocol");

  if (!isPlatform(platform)) {
    throw new HTTPException(400, { message: "Invalid platform" });
  }

  if (!isProtocol(protocol)) {
    throw new HTTPException(400, { message: "Invalid protocol" });
  }

  const data = await cache(c.req.url, async () => {
    const { queryItems: queryBribesV1 } = useCosmosDb("Bribes");
    const { queryItems: queryBribesV2 } = useCosmosDb("BribesV2");
    const { queryItems: queryBribesV3 } = useCosmosDb("BribesV3");

    const query = {
      query:
        "SELECT c.round FROM c WHERE c.platform = @platform AND c.protocol = @protocol",
      parameters: [
        { name: "@platform", value: platform },
        { name: "@protocol", value: protocol },
      ],
    };

    const roundsV1 = await queryBribesV1<{ round: number }>(query);
    const roundsV2 = await queryBribesV2<{ round: number }>(query);
    const roundsV3 = await queryBribesV3<{ round: number }>(query);

    const rounds = roundsV1
      .concat(roundsV2)
      .concat(roundsV3)
      .map((x) => x.round)
      .uniq()
      .orderBy((x) => x, "asc");

    return { statusCode: 200, rounds };
  });

  return c.json(data);
});

export type Result = HonoResultOutput<typeof app, typeof path>;
export default app;
