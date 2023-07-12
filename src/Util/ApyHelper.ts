import { BigNumber, Signer } from "ethers";
import { type Provider } from "@ethersproject/providers";
import { chain, zip } from "lodash";
import {
  CurveV2FactoryPool__factory,
  CvxCrvUtilities__factory,
  CvxFxsRewards__factory,
} from "@/Contracts";
import {
  bigNumToNumber,
  numToBigNumber,
  toRecord,
  getCvxFxsPrice,
  getDefiLlamaPrice,
} from "@/Util";
import {
  CvxAddress,
  CvxCrvAddress,
  CvxCrvUtilities,
  CvxFxsFactoryAddress,
  CvxFxsStaking,
  FxsAddress,
  UCrvStrategyAddress,
  UCrvStrategyAddressV2,
} from "@/Util/Addresses";
import { fetchType } from "@/Services/ServiceBase";
import DefiLlamaService from "@/Services/DefiLlamaService";
import FlyerService from "@/Apps/LlamaAirforce/Pages/Convex/Flyer/Services/FlyerService";

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
  provider: Provider | Signer,
  llamaService: DefiLlamaService,
  address?: string // If empty, you'll get all APRs of all weights.
): Promise<number[]> {
  const util = CvxCrvUtilities__factory.connect(CvxCrvUtilities, provider);

  const mainRates = await (address
    ? util.accountRewardRates(address)
    : util.mainRewardRates()
  ).then((x) => zip(x.tokens, x.rates) as [string, BigNumber][]);

  const extraRates = await (address
    ? util.accountExtraRewardRates(address)
    : util.extraRewardRates()
  ).then((x) => zip(x.tokens, x.rates) as [string, BigNumber][]);

  const rates = chain(mainRates)
    .concat(extraRates)
    // Only take rate > 0
    .filter((x) => x[1].gt(0))
    // Sum the rates of addresses both in main and extra.
    .groupBy((x) => x[0])
    .map((x, address) => ({
      address,
      rate: x.reduce((acc, r) => acc.add(r[1]), BigNumber.from(0)),
    }))
    .value();

  const addresses = chain(rates)
    .map((x) => x.address)
    .concat([CvxCrvAddress])
    .uniq()
    .value();

  const prices = await llamaService.getPrices(addresses).then((coins) =>
    toRecord(
      Object.keys(coins).map((coin) => ({
        address: coin.replace("ethereum:", "").toLocaleLowerCase(),
        price: coins[coin].price,
      })),
      (x) => x.address,
      (x) => numToBigNumber(x.price, 18)
    )
  );

  const aprs = [];
  const priceOfDeposit = prices[CvxCrvAddress];

  for (const rate of rates) {
    // eslint-disable-next-line no-await-in-loop
    const apr = await util.apr(
      rate.rate,
      prices[rate.address.toLocaleLowerCase()],
      priceOfDeposit
    );

    const aprNumber = bigNumToNumber(apr, 18);
    aprs.push(aprNumber);
  }

  return aprs;
}

export async function getCvxCrvApy(
  provider: Provider | Signer,
  llamaService: DefiLlamaService
): Promise<number> {
  const aprs = await getCvxCrvAprs(provider, llamaService, UCrvStrategyAddress);

  // Sum all individual APRs together.
  const apr = aprs.reduce((acc, x) => acc + x, 0);

  return aprToApy(apr * 100, 52);
}

export async function getCvxCrvApyV2(
  provider: Provider | Signer,
  llamaService: DefiLlamaService
): Promise<number> {
  const aprs = await getCvxCrvAprs(
    provider,
    llamaService,
    UCrvStrategyAddressV2
  );

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

  return fetchType<PoolResponse>(SUBGRAPH_URL_CONVEX, { query }).then(
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
  provider: Provider | Signer,
  llamaService: DefiLlamaService
): Promise<number> {
  const rewardsContract = CvxFxsRewards__factory.connect(
    CvxFxsStaking,
    provider
  );

  const getRewardRate = async (address: string): Promise<number> => {
    const rewardData = await rewardsContract.rewardData(address);
    const periodFinish = rewardData.periodFinish;

    if (Date.now() / 1000 >= bigNumToNumber(periodFinish, 0)) {
      return 0;
    }

    return bigNumToNumber(rewardData.rewardRate, 18);
  };

  const rateFxs = await getRewardRate(FxsAddress);
  const rateCvx = await getRewardRate(CvxAddress);
  const supply = bigNumToNumber(await rewardsContract.totalSupply(), 18);

  const curvePool = CurveV2FactoryPool__factory.connect(
    CvxFxsFactoryAddress,
    provider
  );

  const priceCvxFxs = await getCvxFxsPrice(llamaService, curvePool);
  const priceFxs = await getDefiLlamaPrice(llamaService, FxsAddress);
  const priceCvx = await getDefiLlamaPrice(llamaService, CvxAddress);

  const supplyDollars = supply * priceCvxFxs;

  const SecondsPerYear = 31556952;
  const fxsPerYear = (rateFxs / supplyDollars) * SecondsPerYear;
  const cvxPerYear = (rateCvx / supplyDollars) * SecondsPerYear;

  const aprFxs = fxsPerYear * priceFxs;
  const aprCvx = cvxPerYear * priceCvx;
  const apr = aprFxs + aprCvx;

  return aprToApy(apr * 100, 52);
}
