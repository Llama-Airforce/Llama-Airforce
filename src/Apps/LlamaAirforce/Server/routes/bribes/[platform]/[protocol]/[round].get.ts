import {
  Hono,
  HTTPException,
  type HonoResultOutput,
  cache,
} from "@/Framework/Hono";
import {
  type Epoch,
  type EpochId,
  isPlatform,
  isProtocol,
  toIdString,
} from "@LAF/Pages/Bribes/Models";
import { useCosmosDb } from "@LAF/Server/util/useCosmosDb";

const path = "/:platform/:protocol/:round";

const app = new Hono().get(path, async (c) => {
  const platform = c.req.param("platform");
  const protocol = c.req.param("protocol");
  const roundString = c.req.param("round");

  if (!isPlatform(platform)) {
    throw new HTTPException(400, { message: "Invalid platform" });
  }

  if (!isProtocol(protocol)) {
    throw new HTTPException(400, { message: "Invalid protocol" });
  }

  const round = parseInt(roundString, 10);
  if (isNaN(round)) {
    throw new HTTPException(400, { message: "Invalid round" });
  }

  const data = await cache(c.req.url, async () => {
    const epochId: EpochId = { platform, protocol, round };
    const epochIdString = toIdString(epochId);

    // Try to get a V1 bribe, if not try to get a V2.
    const { getItem: getEpochV1 } = useCosmosDb("Bribes");
    const { getItem: getEpochV2 } = useCosmosDb("BribesV2");

    const getEpoch = async (): Promise<Epoch | null> => {
      try {
        return await getEpochV1<Epoch>(epochIdString);
      } catch {
        return await getEpochV2<Epoch>(epochIdString).catch(() => null);
      }
    };

    const epoch = await getEpoch();

    if (epoch === null) {
      throw new HTTPException(404, {
        message: `Epoch '${epochId.round}' not found`,
      });
    }

    return { statusCode: 200, epoch } as { statusCode: number; epoch?: Epoch };
  });

  return c.json(data);
});

export type Result = HonoResultOutput<typeof app, typeof path>;
export default app;
