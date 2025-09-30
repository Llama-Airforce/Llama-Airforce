import {
  type Address,
  type PublicClient,
  type GetContractReturnType,
  erc20Abi as abiERC20,
  getContract,
} from "viem";
import { abi as abiCurveV1 } from "@/ABI/Curve/CurveV1FactoryPool";
import { abi as abiCurveV2 } from "@/ABI/Curve/CurveV2FactoryPool";
import { abi as abiCurveV6 } from "@/ABI/Curve/CurveV6FactoryPool";
import { abi as abiCvxCrv } from "@/ABI/Curve/CvxCrvFactoryPool";
import type { PriceService } from "@/Services";
import type FlyerService from "@/Services/FlyerService";
import {
  CvxAddress,
  LPxCvxFactoryAddress,
  CrvAddress,
  CrvUsdAddress,
  CvxCrvFactoryAddress,
  CvxCrvFactoryAddressV1,
  PrismaAddress,
  CvxPrismaFactoryAddress,
  FxsAddress,
  CvxFxsFactoryAddress,
  CvxFxsFactoryERC20Address,
} from "@/Utils/Addresses";
import { bigNumToNumber, numToBigNumber } from "@/Utils/Number";

type CurveV1FactoryPool = GetContractReturnType<
  typeof abiCurveV1,
  PublicClient
>;
type CurveV2FactoryPool = GetContractReturnType<
  typeof abiCurveV2,
  PublicClient
>;
type CurveV6FactoryPool = GetContractReturnType<
  typeof abiCurveV6,
  PublicClient
>;

async function getDiscount(
  pool: CurveV1FactoryPool | CurveV2FactoryPool | CurveV6FactoryPool
): Promise<number> {
  const dec = 10n ** 18n;
  const tkn_in = 10n ** 22n;
  const tkn_out = await pool.read.get_dy([0n, 1n, tkn_in]);
  const discount = ((tkn_out - tkn_in) * dec) / tkn_out;

  return 1 - bigNumToNumber(discount, 18n);
}

export function getPrice(
  priceService: PriceService,
  address: string
): Promise<number> {
  return priceService
    .getPrice(address)
    .then((x) => x?.price ?? 0)
    .catch(() => 0);
}

export function getCrvUsdPrice(priceService: PriceService): Promise<number> {
  return getPrice(priceService, CrvUsdAddress);
}

export function getReUsdPrice(priceService: PriceService): Promise<number> {
  return getPrice(priceService, ReUsdAddress);
}

export function getCvxPrice(priceService: PriceService): Promise<number> {
  return getPrice(priceService, CvxAddress);
}

export async function getPxCvxPrice(
  priceService: PriceService,
  client: PublicClient
): Promise<number> {
  const cvxPrice = await getPrice(priceService, CvxAddress);
  const price_oracle = await client.readContract({
    abi: abiCurveV2,
    address: LPxCvxFactoryAddress,
    functionName: "price_oracle",
  });
  const decimals = 18n;

  return cvxPrice * bigNumToNumber(price_oracle, decimals);
}

export async function getCvxCrvPrice(
  priceService: PriceService,
  client: PublicClient
): Promise<number> {
  const crvPrice = await getPrice(priceService, CrvAddress);
  const price_oracle = await client.readContract({
    abi: abiCvxCrv,
    address: CvxCrvFactoryAddress,
    functionName: "price_oracle",
  });
  const decimals = 18n;

  return crvPrice * bigNumToNumber(price_oracle, decimals);
}

export async function getCvxPrismaPrice(
  priceService: PriceService,
  client: PublicClient
): Promise<number> {
  const prismaPrice = await getPrice(priceService, PrismaAddress);
  const price_oracle = await client.readContract({
    abi: abiCurveV6,
    address: CvxPrismaFactoryAddress,
    functionName: "price_oracle",
  });
  const decimals = 18n;

  return prismaPrice * bigNumToNumber(price_oracle, decimals);
}

export async function getCvxCrvPriceV2(
  priceService: PriceService,
  client: PublicClient
): Promise<number> {
  const crvPrice = await getPrice(priceService, CrvAddress);

  // Convert crv price to cvxCrv price.
  const pool = getContract({
    abi: abiCurveV1,
    address: CvxCrvFactoryAddressV1,
    client,
  });
  const discount = await getDiscount(pool);

  return crvPrice * discount;
}

export async function getCvxFxsPrice(
  priceService: PriceService,
  client: PublicClient
): Promise<number> {
  const fxsPrice = await getPrice(priceService, FxsAddress);

  const price_oracle = await client.readContract({
    abi: abiCurveV2,
    address: CvxFxsFactoryAddress,
    functionName: "price_oracle",
  });
  const decimals = 18n;

  return fxsPrice * bigNumToNumber(price_oracle, decimals);
}

export async function getCurveV2LpPrice(
  priceService: PriceService,
  client: PublicClient,
  tokenAddress: Address,
  factoryAddress: Address,
  factoryTokenAddress: Address
): Promise<number> {
  const multicallResult = await client.multicall({
    contracts: [
      {
        address: factoryAddress,
        abi: abiCurveV2,
        functionName: "balances",
        args: [0n],
      },
      {
        address: factoryAddress,
        abi: abiCurveV2,
        functionName: "balances",
        args: [1n],
      },
      {
        address: factoryAddress,
        abi: abiCurveV2,
        functionName: "price_oracle",
        args: [],
      },
      {
        address: factoryTokenAddress,
        abi: abiERC20,
        functionName: "totalSupply",
        args: [],
      },
    ],
  });

  // Not gonna bother check success.
  const tvl_tkn = multicallResult[0].result!;
  const tvl_atkn = multicallResult[1].result!;
  const oracle_price = multicallResult[2].result!;
  const supply = multicallResult[3].result!;

  const decimals = 18n;
  const fxsPrice = await priceService
    .getPrice(tokenAddress)
    .then((x) => numToBigNumber(x?.price ?? 0, decimals))
    .catch(() => 0n);
  const dec = 10n ** decimals;

  const tvl = ((tvl_tkn + tvl_atkn) * oracle_price) / dec;
  const tvl_dollars = (tvl * fxsPrice) / dec;
  const lp_price = (tvl_dollars * dec) / supply;

  return bigNumToNumber(lp_price, decimals);
}

export async function getCvxFxsLpPrice(
  priceService: PriceService,
  client: PublicClient
): Promise<number> {
  return getCurveV2LpPrice(
    priceService,
    client,
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
