import type * as TE from "fp-ts/TaskEither";
import { fetchType as fetch } from "@/Services/ServiceBase";
import { type Network } from "@/Jobs/Bribes/Network";
import { taskToTE } from "@/Jobs/Bribes/fp";
import { sleep, toUnixSeconds } from "@/Util";

type Currency = "usd";

export function getPrice(
  address: string,
  network: Network,
  currency: Currency
): TE.TaskEither<Error, number> {
  return taskToTE(async () => {
    const url = `https://api.coingecko.com/api/v3/simple/token_price/${network}?contract_addresses=${address}&vs_currencies=${currency}`;

    try {
      const resp = await fetch<Record<string, Record<string, string>>>(url);

      // Rate limit CoinGecko call.
      await sleep(600);

      return parseFloat(resp[address][currency]);
    } catch (err) {
      if (err instanceof Error) {
        console.log(
          `Unable to get CoinGecko price data for address ${address} with currency ${currency}`
        );
        throw err;
      }

      throw new Error("Unknown error");
    }
  });
}

export function getPriceAtTime(
  address: string,
  network: Network,
  currency: Currency,
  date: Date
): TE.TaskEither<Error, number> {
  return taskToTE(async () => {
    const target = toUnixSeconds(date);

    const fromDate = new Date(date.getTime());
    fromDate.setHours(fromDate.getHours() - 2);
    const from = toUnixSeconds(fromDate);

    const toDate = new Date(date.getTime());
    toDate.setHours(toDate.getHours() + 2);
    const to = toUnixSeconds(toDate);

    const url = `https://api.coingecko.com/api/v3/coins/${network}/contract/${address}/market_chart/range?vs_currency=${currency}&from=${from}&to=${to}`;

    try {
      const resp = await fetch<{ prices: [number, number][] }>(url);

      // Rate limit CoinGecko call.
      await sleep(1200);

      const closest = resp.prices
        .map((x) => ({ time: x[0] / 1000, price: x[1] }))
        .reduce(
          (acc, cur) => {
            return Math.abs(target - acc.time) < Math.abs(target - cur.time)
              ? acc
              : cur;
          },
          { time: Number.MAX_SAFE_INTEGER, price: 0 }
        );

      if (closest.time === Number.MAX_SAFE_INTEGER) {
        throw new Error("Could not find closest price in range");
      } else {
        return closest.price;
      }
    } catch (err) {
      if (err instanceof Error) {
        console.log(
          `Unable to get CoinGecko range price data for address ${address} with currency ${currency}`
        );
        throw err;
      }

      throw new Error("Unknown error");
    }
  });
}
