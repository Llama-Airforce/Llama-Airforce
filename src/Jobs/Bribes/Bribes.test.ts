import { beforeEach, test, describe, expect } from "vitest";
import { GaugeVotePlatform__factory } from "@/Contracts";
import { ethers } from "ethers";
import { JsonRpcProvider } from "@ethersproject/providers";
import dotenv from "dotenv";
import * as TE from "fp-ts/TaskEither";
import { pipe } from "fp-ts/function";
import { GaugeVotePlatformAddress } from "@/Util/Addresses";
import { L2VotingService } from "@LAF/Pages/Bribes/Rounds/Services/L2VotingService";
import { chainLeft, taskToTE } from "@/Jobs/Bribes/fp";
import { getBribes } from "@/Jobs/Bribes/Bribes";
import { getEpochs } from "@/Jobs/Bribes/Votium";
import { getGauges } from "@/Jobs/Bribes/Curve";
import { getPrice as getPriceF, getNetwork } from "@/Jobs/Bribes/Price";
import { toUnixSeconds } from "@/Util";

dotenv.config({ path: "./.env" });

describe("Bribes", () => {
  let providerETH: ethers.providers.AlchemyProvider;
  let providerZKEVM: JsonRpcProvider;
  let votingService: L2VotingService;

  beforeEach(() => {
    providerZKEVM = new JsonRpcProvider("https://zkevm-rpc.com");

    const votePlatform = GaugeVotePlatform__factory.connect(
      GaugeVotePlatformAddress,
      providerZKEVM
    );

    votingService = new L2VotingService(providerZKEVM, votePlatform);

    providerETH = new ethers.providers.AlchemyProvider(
      "homestead",
      process.env.ALCHEMY_KEY
    );
  });

  test("process epoch", async () => {
    const getPrice = (proposalEnd: number, address: string, symbol: string) => {
      /*
       * Try to get the price at the end of the day of the deadline.
       * If the proposal ends later than now (ongoing proposal), we take current prices.
       * proposalEnd is assumed to be in unix time seconds already.
       */
      const now = toUnixSeconds(new Date());
      const date = new Date(1000 * (proposalEnd > now ? now : proposalEnd));

      const network = getNetwork(symbol);

      return pipe(
        getPriceF(address, network, date, symbol),
        // If the price fails for a given time, use spot price.
        chainLeft(() => getPriceF(address, network))
      );
    };

    const options = {
      provider: providerETH,
      getPrice,
      votingService,
      getEpochs: () => taskToTE(() => getEpochs()),
      getGauges: () => taskToTE(() => getGauges()),
    };

    const bribes = await pipe(
      getBribes(options),
      TE.match(
        (l) => {
          throw l;
        },
        (r) => r
      )
    )();

    expect(bribes.scoresTotal > 0).toBe(true);
  }, 60000);
});
