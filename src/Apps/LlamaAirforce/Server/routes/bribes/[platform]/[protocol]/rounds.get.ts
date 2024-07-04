import _ from "lodash";
import { isPlatform, isProtocol } from "@LAF/Pages/Bribes/Models";
import { useCosmosDb } from "@LAF/Server/util/useCosmosDb";

export type Result = Awaited<ReturnType<typeof handler>>;

const handler = defineCachedEventHandler(
  async (event) => {
    const { platform, protocol } = getRouterParams(event);

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

    const rounds = _.chain(roundsV1)
      .concat(roundsV2)
      .concat(roundsV3)
      .map((x) => x.round)
      .uniq()
      .orderBy((x) => x, "asc")
      .value();

    return {
      statusCode: 200,
      rounds,
    };
  },
  { maxAge: 60 }
);

export default handler;
