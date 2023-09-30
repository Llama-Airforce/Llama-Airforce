import type * as TE from "fp-ts/TaskEither";
import { fetchType as fetch } from "@/Services/ServiceBase";
import { type Network } from "@/Jobs/Bribes/Network";
import { taskToTE } from "@/Jobs/Bribes/fp";
import { toUnixSeconds } from "@/Util";

const PRICES_URL = "https://coins.llama.fi/prices/historical";

export function getPrice(
  address: string,
  network: Network,
  date?: Date
): TE.TaskEither<Error, number> {
  return taskToTE(async () => {
    const timestamp = !date ? 0 : toUnixSeconds(date);
    const coin = `${network}:${address}`;
    const url = `${PRICES_URL}/${timestamp}/${coin}`;

    try {
      const resp = await fetch<{
        coins: {
          [coin: string]: {
            price: number;
            decimals: number;
            symbol: string;
            timestamp: number;
          };
        };
      }>(url);

      return resp.coins[coin].price;
    } catch (err) {
      if (err instanceof Error) {
        console.log(
          `Unable to get DefiLlama price data for address ${address}`
        );
        throw err;
      }

      throw new Error("Unknown error");
    }
  });
}
