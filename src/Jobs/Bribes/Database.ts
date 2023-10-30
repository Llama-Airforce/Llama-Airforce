import { CosmosClient } from "@azure/cosmos";
import type * as TE from "fp-ts/TaskEither";
import { taskToTE } from "@/Jobs/Bribes/fp";

export type BribeDb = {
  pool: string;
  token: string;
  gauge: string;
  amount: number;
  amountDollars: number;
  maxPerVote: number;
  excluded: string[];
};

export type EpochDb = {
  id: string;
  platform: string;
  protocol: string;
  round: number;
  proposal: string;
  end: number;
  scoresTotal: number;
  bribed: Record<string, number>;
  bribes: BribeDb[];
};

export function upload(
  endpoint: string,
  key: string,
  epoch: EpochDb
): TE.TaskEither<Error, EpochDb> {
  return taskToTE(async () => {
    console.log(`Uploading epoch: ${epoch.round}`);

    const client = new CosmosClient({ endpoint, key });
    const { database } = await client.databases.createIfNotExists({
      id: "LlamaAirforce-dev",
    });
    const { container } = await database.containers.createIfNotExists({
      id: "BribesV3",
      partitionKey: "/id",
    });

    await container.items.upsert(epoch);

    return epoch;
  });
}
