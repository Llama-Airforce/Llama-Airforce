import { uniqBy } from "lodash";
import { getAddress } from "ethers/lib/utils";
import { type JsonRpcProvider } from "@ethersproject/providers";
import * as TE from "fp-ts/TaskEither";
import { pipe } from "fp-ts/function";
import { sequenceT } from "fp-ts/Apply";
import { ERC20__factory } from "@/Contracts";
import { bigNumToNumber, toUnixSeconds } from "@/Util";
import { type EpochId, epochIdToString } from "@LAF/Pages/Bribes/Models";
import { type L2VotingService } from "@LAF/Pages/Bribes/Rounds/Services/L2VotingService";
import { type Gauge } from "@/Jobs/Bribes/Curve";
import { chainLeft, taskToTE } from "@/Jobs/Bribes/fp";
import {
  type Bribe as BribeVotium,
  type Epoch as EpochVotium,
} from "@/Jobs/Bribes/Votium";
import { getPrice as getPriceF, getNetwork } from "@/Jobs/Bribes/Price";
import { type BribeDb, type EpochDb } from "@/Jobs/Bribes/Database";

type UpdateBribesOptions = {
  provider: JsonRpcProvider;
  votingService: L2VotingService;
  getEpochs: () => TE.TaskEither<Error, EpochVotium[]>;
  getGauges: () => TE.TaskEither<Error, Record<string, Gauge>>;
  uploadEpoch: (epoch: EpochDb) => TE.TaskEither<Error, EpochDb>;
};

export function updateBribes(options: UpdateBribesOptions) {
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

  // Get bribes ready for publishing to the database.
  const bribes = getBribes({ ...options, getPrice });

  // Publish new bribe data to database on success.
  return pipe(
    bribes,
    TE.chain(options.uploadEpoch),
    TE.match(
      (l) => {
        console.log(`Failed to update bribes: ${l.stack}`);
      },
      (r) => {
        console.log(
          `Succesfully uploaded bribes for ${r.id}, scores total: ${r.scoresTotal}`
        );
      }
    )
  )();
}

export type GetBribesOptions = {
  provider: JsonRpcProvider;
  getPrice: (
    proposalEnd: number,
    address: string,
    symbol: string
  ) => TE.TaskEither<Error, number>;
  votingService: L2VotingService;
  getEpochs: () => TE.TaskEither<Error, EpochVotium[]>;
  getGauges: () => TE.TaskEither<Error, Record<string, Gauge>>;
};

export function getBribes(
  options: GetBribesOptions
): TE.TaskEither<Error, EpochDb> {
  const epochs_ = options.getEpochs();
  const gauges_ = options.getGauges();

  // Votium V2 rounds start with 51.
  const VOTIUM_V2_OFFSET = 51;

  const dbEpoch = pipe(
    sequenceT(TE.ApplySeq)(epochs_, gauges_),
    TE.chain(([epochs, gauges]) =>
      taskToTE(() => {
        const epoch = epochs.reverse()[0];
        const epochOptions: ProcessEpochOptions = {
          ...options,
          index: epochs.length - 1 + VOTIUM_V2_OFFSET,
          gauges,
        };

        return processEpoch(epochOptions, epoch);
      })
    )
  );

  return dbEpoch;
}

/** Epoch processing. */
type ProcessEpochOptions = {
  index: number; // Index is what users see as round number.
  gauges: Record<string, Gauge>;
  provider: JsonRpcProvider;
  getPrice: (
    proposalEnd: number,
    address: string,
    symbol: string
  ) => TE.TaskEither<Error, number>;
  votingService: L2VotingService;
};

async function processEpoch(
  options: ProcessEpochOptions,
  epoch: EpochVotium
): Promise<EpochDb> {
  const epochId: EpochId = {
    platform: "votium",
    protocol: "cvx-crv",
    round: options.index + 1,
  };

  console.log(`Updating bribes ${epochIdToString(epochId)}`);

  const L2_OFFSET = 55; // The round id the L2 proposal indices start with.
  const proposalId = epoch.round - L2_OFFSET;
  const proposalEnd = await options.votingService
    .getProposal(proposalId)
    .then((x) => Number(x.endTime));

  const bribeOptions: ProcessBribeOptions = {
    ...options,
    getPrice: (address: string, symbol: string) =>
      options.getPrice(proposalEnd, address, symbol),
  };

  // Process bribes sequentially.
  console.log("Processing bribes.");
  const bribes: BribeDb[] = [];
  for (const bribe of epoch.bribes) {
    try {
      // eslint-disable-next-line no-await-in-loop
      const bribeDb = await processBribe(bribeOptions, bribe);
      bribes.push(bribeDb);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.log(
          `Failed to process bribe with token '${bribe.token}' and gauge '${bribe.gauge}'`
        );
        console.log(err.stack);
      }
    }
  }

  // Process the bribed amounts per gauge sequentially.
  console.log("Processing bribed.");
  const bribed: Record<string, number> = {};
  for (const bribe of uniqBy(bribes, (x) => x.gauge)) {
    // eslint-disable-next-line no-await-in-loop
    const score = await options.votingService.votePlatform
      .gaugeTotals(proposalId, bribe.gauge)
      .then((x) => bigNumToNumber(x.toBigInt(), 18n));

    const scoreCurrent = bribed[bribe.pool] ?? 0;
    bribed[bribe.pool] = scoreCurrent + score;
  }

  console.log("Get scores total");
  const scoresTotal = await options.votingService.votePlatform
    .voteTotals(proposalId)
    .then((x) => bigNumToNumber(x.toBigInt(), 18n));

  return {
    id: epochIdToString(epochId),
    platform: epochId.platform,
    protocol: epochId.protocol,
    round: epochId.round,
    end: proposalEnd,
    proposal: proposalId.toString(),
    scoresTotal,
    bribed,
    bribes,
  };
}

/** Bribe processing. */
type ProcessBribeOptions = {
  provider: JsonRpcProvider;
  gauges: Record<string, Gauge>;
  getPrice: (address: string, symbol: string) => TE.TaskEither<Error, number>;
};

async function processBribe(
  options: ProcessBribeOptions,
  bribe: BribeVotium
): Promise<BribeDb> {
  console.log(
    `Processing bribe for gauge ${bribe.gauge} - ${bribe.token} - ${bribe.amount}`
  );

  const gaugeAddr = getAddress(bribe.gauge).toLocaleLowerCase();
  const gauge = options.gauges[gaugeAddr];

  if (!gauge) {
    throw new Error(`Could not find gauge for gauge address ${gaugeAddr}`);
  }

  const tokenAddr = getAddress(bribe.token).toLocaleLowerCase();
  const erc20 = ERC20__factory.connect(tokenAddr, options.provider);
  const decimals = await erc20.decimals().then((x) => BigInt(x));

  const amount = bigNumToNumber(BigInt(bribe.amount), decimals);
  const maxPerVote = bigNumToNumber(BigInt(bribe.maxPerVote), decimals);

  // Convert any price error to $0, but also log it.
  const symbol = await erc20.symbol();
  const price = await pipe(
    options.getPrice(tokenAddr, symbol),
    TE.match(
      (l) => {
        console.log(l.stack);
        return 0;
      },
      (r) => r
    )
  )();

  return {
    pool: gauge.shortName,
    token: symbol,
    gauge: gauge.gauge,
    amount,
    amountDollars: amount * price,
    maxPerVote,
    excluded: [],
  };
}
