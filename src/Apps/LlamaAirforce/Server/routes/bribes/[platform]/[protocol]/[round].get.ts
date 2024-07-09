import {
  type Epoch,
  type EpochId,
  isPlatform,
  isProtocol,
  toIdString,
} from "@LAF/Pages/Bribes/Models";
import { useCosmosDb } from "@LAF/Server/util/useCosmosDb";

export type Result = Awaited<ReturnType<typeof handler>>;

const handler = defineCachedEventHandler(
  async (event) => {
    const { platform, protocol, round: roundString } = getRouterParams(event);

    if (!isPlatform(platform)) {
      throw createError({
        statusCode: 400,
        message: "Invalid platform",
      });
    }

    if (!isProtocol(protocol)) {
      throw createError({
        statusCode: 400,
        message: "Invalid protocol",
      });
    }

    const round = parseInt(roundString, 10);
    if (isNaN(round)) {
      throw createError({
        statusCode: 400,
        message: "Invalid round",
      });
    }

    const epochId: EpochId = {
      platform,
      protocol,
      round,
    };
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
      throw createError({
        statusCode: 404,
        message: `Epoch '${epochId.round}' not found`,
      });
    }

    return {
      statusCode: 200,
      epoch,
    } as { statusCode: number; epoch?: Epoch };
  },
  { maxAge: 60 }
);

export default handler;
