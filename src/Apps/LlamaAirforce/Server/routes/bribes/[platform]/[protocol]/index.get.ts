import { type Result as RoundsResponse } from "@LAF/Server/routes/bribes/[platform]/[protocol]/rounds.get";
import { type Result as EpochResponse } from "@LAF/Server/routes/bribes/[platform]/[protocol]/[round].get";

export type Result = Awaited<ReturnType<typeof handler>>;

const handler = defineCachedEventHandler(
  async (event) => {
    const { platform, protocol } = getRouterParams(event);

    // Get latest round.
    const { rounds } = await $fetch<RoundsResponse>(
      `/bribes/${platform}/${protocol}/rounds`
    );
    const latestRound = rounds.at(-1);

    if (!latestRound) {
      throw createError({
        statusCode: 404,
        message: "No rounds found",
      });
    }

    // Fetch data for latest round.
    const data = await $fetch<EpochResponse>(
      `/bribes/${platform}/${protocol}/${latestRound}`
    );

    return data;
  },
  { maxAge: 60 }
);

export default handler;
