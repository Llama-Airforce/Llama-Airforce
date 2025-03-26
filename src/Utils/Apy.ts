import { type Address, type PublicClient, getContract } from "viem";
import { abi as abiCvxCrvUtil } from "@/ABI/Convex/CvxCrvUtilities";
import { abi as abiCvxFxsUtil } from "@/ABI/Convex/CvxFxsRewards";
import { abi as abiCvxPrismaUtil } from "@/ABI/Convex/CvxPrismaRewards";
import type { PriceService } from "@/Services";
import type FlyerService from "@/Services/FlyerService";
import {
  CvxAddress,
  CvxCrvAddress,
  CvxCrvUtilities,
  CvxFxsStaking,
  CvxPrismaStaking,
  FxsAddress,
  PrismaAddress,
  MkUsdAddress,
  UCrvStrategyAddress,
  UCrvStrategyAddressV2,
} from "@/Utils/Addresses";
import { toRecord } from "@/Utils/Array";
import { bigNumToNumber, numToBigNumber } from "@/Utils/Number";
import { getCvxFxsPrice, getCvxPrismaPrice, getPrice } from "@/Utils/Price";
import { fetchJson } from "./fetch";

/**
 * Assumes weekly compounding. Apr is a [0, 100] percentage.
 * @param apr The apr to compound.
 * @param periods Amount of times to compound per year.
 * @returns The APR compounded into APY.
 */
function aprToApy(apr: number, periods: number): number {
  return (Math.pow(1 + apr / 100 / periods, periods) - 1) * 100;
}

export function getCvxApy(flyerService: FlyerService): Promise<number> {
  return flyerService
    .getConvex()
    .then((resp) => aprToApy(resp.dashboard?.cvxApr ?? 0, 26))
    .catch(() => 0);
}

export async function getCvxCrvAprs(
  client: PublicClient,
  priceService: PriceService,
  address?: Address // If empty, you'll get all APRs of all weights.
): Promise<number[]> {
  const util = getContract({
    abi: abiCvxCrvUtil,
    address: CvxCrvUtilities,
    client,
  });

  const mainRates = await (address
    ? util.read.accountRewardRates([address])
    : util.read.mainRewardRates()
  ).then(
    ([tokens, rates]) => [...tokens].zip([...rates]) as [string, bigint][]
  );

  const extraRates = await (address
    ? util.read.accountExtraRewardRates([address])
    : util.read.extraRewardRates()
  ).then(
    ([tokens, rates]) => [...tokens].zip([...rates]) as [string, bigint][]
  );

  const rates = mainRates
    .concat(extraRates)
    // Only take rate > 0
    .filter((x) => x[1] > 0)
    // Sum the rates of addresses both in main and extra.
    .groupBy((x) => x[0])
    .entries()
    .map(([address, x]) => ({
      address,
      rate: x.reduce((acc, r) => acc + r[1], BigInt(0)),
    }));

  const addresses = rates
    .map((x) => x.address)
    .concat([CvxCrvAddress])
    .uniq();

  const prices = await priceService.getPrices(addresses).then((coins) =>
    toRecord(
      Object.keys(coins).map((coin) => ({
        address: coin.replace("ethereum:", "").toLocaleLowerCase(),
        price: coins[coin].price,
      })),
      (x) => x.address,
      (x) => numToBigNumber(x.price, 18n)
    )
  );

  const aprs = [];
  const priceOfDeposit = prices[CvxCrvAddress];

  for (const rate of rates) {
    // eslint-disable-next-line no-await-in-loop
    const apr = await util.read.apr([
      rate.rate,
      prices[rate.address.toLocaleLowerCase()],
      priceOfDeposit,
    ]);

    const aprNumber = bigNumToNumber(apr, 18n);
    aprs.push(aprNumber);
  }

  return aprs;
}

export async function getCvxCrvApy(
  client: PublicClient,
  priceService: PriceService
): Promise<number> {
  const aprs = await getCvxCrvAprs(client, priceService, UCrvStrategyAddress);

  // Sum all individual APRs together.
  const apr = aprs.reduce((acc, x) => acc + x, 0);

  return aprToApy(apr * 100, 52);
}

export async function getCvxCrvApyV2(
  client: PublicClient,
  priceService: PriceService
): Promise<number> {
  const aprs = await getCvxCrvAprs(client, priceService, UCrvStrategyAddressV2);

  // Sum all individual APRs together.
  const apr = aprs.reduce((acc, x) => acc + x, 0);

  return aprToApy(apr * 100, 52);
}

type PoolResponse = {
  data: {
    pools: {
      baseApr: string;
      crvApr: string;
      cvxApr: string;
      extraRewardsApr: string;
      snapshots: {
        baseApr: string;
        crvApr: string;
        cvxApr: string;
        extraRewardsApr: string;
      }[];
    }[];
  };
};

export function getCvxFxsLpApy(): Promise<number> {
  // The graph has migrated and therefore we stop supporting this.
  return Promise.resolve(0.01);

  const SUBGRAPH_URL_CONVEX =
    "https://api.thegraph.com/subgraphs/name/convex-community/curve-pools";

  const query = `{
    pools(
      where: {
        name:"Curve.fi Factory Crypto Pool: cvxFxs/Fxs"
      }
    ) {
      baseApr
      crvApr
      cvxApr
      extraRewardsApr
      snapshots(first: 1 orderBy: timestamp orderDirection:desc){
        baseApr
        crvApr
        cvxApr
        extraRewardsApr
      }
    } }`;

  return fetchJson<PoolResponse>(SUBGRAPH_URL_CONVEX, { query }).then(
    (resp) => {
      const baseApr = parseFloat(resp.data.pools[0].snapshots[0].baseApr);
      const crvApr = parseFloat(resp.data.pools[0].snapshots[0].crvApr);
      const cvxApr = parseFloat(resp.data.pools[0].snapshots[0].cvxApr);
      const extraRewardsApr = parseFloat(
        resp.data.pools[0].snapshots[0].extraRewardsApr
      );

      const apr = baseApr + crvApr + cvxApr + extraRewardsApr;
      return aprToApy(apr * 100, 52);
    }
  );
}

export function getAuraBalApy(flyerService: FlyerService): Promise<number> {
  return flyerService
    .getAura()
    .then((resp) => aprToApy(resp.dashboard?.auraBalApr ?? 0, 52))
    .catch(() => 0);
}

export async function getCvxFxsApy(
  client: PublicClient,
  priceService: PriceService
): Promise<number> {
  const util = getContract({
    abi: abiCvxFxsUtil,
    address: CvxFxsStaking,
    client,
  });

  const getRewardRate = async (address: Address): Promise<number> => {
    const [periodFinish, rewardRate] = await util.read.rewardData([address]);

    if (Date.now() / 1000 >= bigNumToNumber(periodFinish, 0n)) {
      return 0;
    }

    return bigNumToNumber(rewardRate, 18n);
  };

  const rateFxs = await getRewardRate(FxsAddress);
  const rateCvx = await getRewardRate(CvxAddress);
  const supply = bigNumToNumber(await util.read.totalSupply(), 18n);

  const priceCvxFxs = await getCvxFxsPrice(priceService, client);
  const priceFxs = await getPrice(priceService, FxsAddress);
  const priceCvx = await getPrice(priceService, CvxAddress);

  const supplyDollars = supply * priceCvxFxs;

  const SecondsPerYear = 31556952;
  const fxsPerYear = (rateFxs / supplyDollars) * SecondsPerYear;
  const cvxPerYear = (rateCvx / supplyDollars) * SecondsPerYear;

  const aprFxs = fxsPerYear * priceFxs;
  const aprCvx = cvxPerYear * priceCvx;
  const apr = aprFxs + aprCvx;

  return aprToApy(apr * 100, 52);
}

export async function getCvxPrismaApy(
  client: PublicClient,
  priceService: PriceService
): Promise<number> {
  const util = getContract({
    abi: abiCvxPrismaUtil,
    address: CvxPrismaStaking,
    client,
  });

  const getRewardRate = async (address: Address): Promise<number> => {
    const [periodFinish, rewardRate] = await util.read.rewardData([address]);

    if (Date.now() / 1000 >= bigNumToNumber(periodFinish, 0n)) {
      return 0;
    }

    return bigNumToNumber(rewardRate, 18n);
  };

  const ratePrisma = await getRewardRate(PrismaAddress);
  const rateCvx = await getRewardRate(CvxAddress);
  const rateMkUsd = await getRewardRate(MkUsdAddress);
  const supply = bigNumToNumber(await util.read.totalSupply(), 18n);

  const priceCvxPrisma = await getCvxPrismaPrice(priceService, client);
  const pricePrisma = await getPrice(priceService, PrismaAddress);
  const priceCvx = await getPrice(priceService, CvxAddress);
  const priceMkUsd = await getPrice(priceService, MkUsdAddress);

  const supplyDollars = supply * priceCvxPrisma;

  const SecondsPerYear = 31556952;
  const prismaPerYear = (ratePrisma / supplyDollars) * SecondsPerYear;
  const cvxPerYear = (rateCvx / supplyDollars) * SecondsPerYear;
  const mkUsdPerYear = (rateMkUsd / supplyDollars) * SecondsPerYear;

  const aprPrisma = prismaPerYear * pricePrisma;
  const aprCvx = cvxPerYear * priceCvx;
  const aprMkUsd = mkUsdPerYear * priceMkUsd;
  const apr = aprPrisma + aprCvx + aprMkUsd;

  return aprToApy(apr * 100, 52);
}
