import { fetchType as fetch } from "@/Services/ServiceBase";

export type Bribe = {
  token: string;
  gauge: string;
  amount: string;
  maxPerVote: string;
};

export type Epoch = {
  round: number; // Not the round number users expect, because rounds have reset with e.g. Convex L2.
  bribes: Bribe[];
};

const VOTIUM_URL =
  "https://api.thegraph.com/subgraphs/name/convex-community/votium-v2";

export async function getEpochs(): Promise<Epoch[]> {
  const query = `{
    rounds(
        where: { bribeCount_gt: 0 }
        first: 1000
        orderBy: initiatedAt
        orderDirection: asc
    ) {
      id
      initiatedAt
      bribeCount
      incentives {
        gauge
        token
        amount
        maxPerVote
      }
    } }`;

  const rounds = await fetch<{
    data: {
      rounds: {
        id: string; // Not the round number users expect, because rounds have reset with e.g. Convex L2.
        incentives: Bribe[];
      }[];
    };
  }>(VOTIUM_URL, {
    query,
  }).then((x) => x.data.rounds);

  return rounds
    .map((epoch) => ({
      round: parseInt(epoch.id, 10),
      bribes: epoch.incentives,
    }))
    .filter((epoch) => {
      // Filter out epochs that haven't started yet.
      const epochStart = 1348 * 86400 * 14 + epoch.round * 86400 * 14;
      return epochStart <= new Date().getTime() / 1000;
    });
}
