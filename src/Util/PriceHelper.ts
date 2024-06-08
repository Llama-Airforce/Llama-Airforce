import { type JsonRpcProvider } from "@ethersproject/providers";
import {
  type ContractCallContext,
  type ContractCallResults,
  Multicall,
} from "ethereum-multicall";
import CurveV2FactoryPoolABI from "@/ABI/Curve/CurveV2FactoryPool.json";
import ERC20ABI from "@/ABI/Standards/ERC20.json";
import { type CurveV2FactoryPool, type CurveV6FactoryPool } from "@/Contracts";
import {
  CvxAddress,
  CvxFxsFactoryAddress,
  CvxFxsFactoryERC20Address,
  FxsAddress,
  PrismaAddress,
} from "@/Util/Addresses";
import { bigNumToNumber, numToBigNumber } from "@/Util/NumberHelper";
import { type DefiLlamaService } from "@/Services";
import type FlyerService from "@/Services/FlyerService";

export function getDefiLlamaPrice(
  llamaService: DefiLlamaService,
  address: string
): Promise<number> {
  return llamaService
    .getPrice(address)
    .then((x) => x.price)
    .catch(() => 0);
}

export function getCvxPrice(llamaService: DefiLlamaService): Promise<number> {
  return getDefiLlamaPrice(llamaService, CvxAddress);
}

export async function getCvxPrismaPrice(
  llamaService: DefiLlamaService,
  cvxPrismaFactoryPool: CurveV6FactoryPool
): Promise<number> {
  const prismaPrice = await getDefiLlamaPrice(llamaService, PrismaAddress);

  return cvxPrismaFactoryPool
    .price_oracle()
    .then((x) => x.toBigInt())
    .then((price) => bigNumToNumber(price, 18n) * prismaPrice);
}

export async function getCvxFxsPrice(
  llamaService: DefiLlamaService,
  cvxFxsFactoryPool: CurveV2FactoryPool
): Promise<number> {
  const fxsPrice = await getDefiLlamaPrice(llamaService, FxsAddress);

  return cvxFxsFactoryPool
    .price_oracle()
    .then((x) => x.toBigInt())
    .then((price) => bigNumToNumber(price, 18n) * fxsPrice);
}

export async function getCurveV2LpPrice(
  llamaService: DefiLlamaService,
  provider: JsonRpcProvider,
  tokenAddress: string,
  factoryAddress: string,
  factoryTokenAddress: string
): Promise<number> {
  const multicall = new Multicall({
    ethersProvider: provider,
    tryAggregate: true,
  });

  const contractCallContext: ContractCallContext[] = [
    {
      reference: "factory",
      contractAddress: factoryAddress,
      abi: CurveV2FactoryPoolABI as unknown[],
      calls: [
        {
          reference: "factory",
          methodName: "balances",
          methodParameters: [0],
        },
        {
          reference: "factory",
          methodName: "balances",
          methodParameters: [1],
        },
        {
          reference: "factory",
          methodName: "price_oracle",
          methodParameters: [],
        },
      ],
    },
    {
      reference: "factoryerc20",
      contractAddress: factoryTokenAddress,
      abi: ERC20ABI as unknown[],
      calls: [
        {
          reference: "factoryerc20",
          methodName: "totalSupply",
          methodParameters: [],
        },
      ],
    },
  ];

  const results: ContractCallResults = await multicall.call(
    contractCallContext
  );
  const valuesFactory = results.results.factory.callsReturnContext;
  const valuesFactoryERC20 = results.results.factoryerc20.callsReturnContext;

  /* eslint-disable @typescript-eslint/no-unsafe-member-access */
  const tvl_tkn = BigInt(valuesFactory[0].returnValues[0].hex as string);
  const tvl_atkn = BigInt(valuesFactory[1].returnValues[0].hex as string);
  const oracle_price = BigInt(valuesFactory[2].returnValues[0].hex as string);
  const supply = BigInt(valuesFactoryERC20[0].returnValues[0].hex as string);
  /* eslint-enable */

  const decimals = 18n;
  const fxsPrice = await llamaService
    .getPrice(tokenAddress)
    .then((x) => numToBigNumber(x.price, decimals))
    .catch(() => 0n);
  const dec = 10n ** decimals;

  const tvl = ((tvl_tkn + tvl_atkn) * oracle_price) / dec;
  const tvl_dollars = (tvl * fxsPrice) / dec;
  const lp_price = (tvl_dollars * dec) / supply;

  return bigNumToNumber(lp_price, decimals);
}

export async function getCvxFxsLpPrice(
  llamaService: DefiLlamaService,
  provider: JsonRpcProvider
): Promise<number> {
  return getCurveV2LpPrice(
    llamaService,
    provider,
    FxsAddress,
    CvxFxsFactoryAddress,
    CvxFxsFactoryERC20Address
  );
}

export async function getAuraBalPrice(
  flyerService: FlyerService
): Promise<number> {
  const auraBalPrice = flyerService
    .getAura()
    .then((resp) => resp.dashboard?.auraBalPrice ?? 0)
    .catch(() => 0);

  return auraBalPrice;
}
