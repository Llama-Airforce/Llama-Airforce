import { BigNumber } from "ethers";
import { JsonRpcProvider } from "@ethersproject/providers";
import {
  ContractCallContext,
  ContractCallResults,
  Multicall,
} from "ethereum-multicall";
import CurveV2FactoryPoolABI from "@/ABI/Curve/CurveV2FactoryPool.json";
import ERC20ABI from "@/ABI/Standards/ERC20.json";
import {
  CurveV1FactoryPool,
  CurveV2FactoryPool,
  CvxCrvFactoryPool,
} from "@/Contracts";
import {
  CrvAddress,
  CvxAddress,
  CvxFxsFactoryAddress,
  CvxFxsFactoryERC20Address,
  FxsAddress,
} from "@/Util/Addresses";
import { bigNumToNumber, numToBigNumber } from "@/Util/NumberHelper";
import FlyerService from "@/Pages/Convex/Flyer/Services/FlyerService";
import DefiLlamaService from "@/Services/DefiLlamaService";

export async function getDiscount(
  pool: CurveV1FactoryPool | CurveV2FactoryPool
): Promise<number> {
  const dec = BigNumber.from(10).pow(18);
  const tkn_in = BigNumber.from(10).pow(22);
  const tkn_out = await pool.get_dy(0, 1, tkn_in);
  const discount = tkn_out.sub(tkn_in).mul(dec).div(tkn_out);

  return 1 - bigNumToNumber(discount, 18);
}

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

export async function getPxCvxPrice(
  llamaService: DefiLlamaService,
  pxCvxFactoryPool: CurveV2FactoryPool
): Promise<number> {
  const cvxPrice = await getDefiLlamaPrice(llamaService, CvxAddress);
  const price_oracle = await pxCvxFactoryPool.price_oracle();
  const decimals = 18;

  return cvxPrice * bigNumToNumber(price_oracle, decimals);
}

export async function getCvxCrvPrice(
  llamaService: DefiLlamaService,
  cvxCrvFactoryPool: CvxCrvFactoryPool
): Promise<number> {
  const crvPrice = await getDefiLlamaPrice(llamaService, CrvAddress);

  return cvxCrvFactoryPool
    .price_oracle()
    .then((price) => bigNumToNumber(price, 18) * crvPrice);
}

export async function getCvxCrvPriceV2(
  llamaService: DefiLlamaService,
  cvxCrvFactoryPool: CurveV1FactoryPool
): Promise<number> {
  const crvPrice = await getDefiLlamaPrice(llamaService, CrvAddress);

  // Convert crv price to cvxCrv price.
  const discount = await getDiscount(cvxCrvFactoryPool);

  return crvPrice * discount;
}

export async function getCvxFxsPrice(
  llamaService: DefiLlamaService,
  cvxFxsFactoryPool: CurveV2FactoryPool
): Promise<number> {
  const fxsPrice = await getDefiLlamaPrice(llamaService, FxsAddress);

  return cvxFxsFactoryPool
    .price_oracle()
    .then((price) => bigNumToNumber(price, 18) * fxsPrice);
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

  const tvl_tkn = BigNumber.from(valuesFactory[0].returnValues[0]);
  const tvl_atkn = BigNumber.from(valuesFactory[1].returnValues[0]);
  const oracle_price = BigNumber.from(valuesFactory[2].returnValues[0]);
  const supply = BigNumber.from(valuesFactoryERC20[0].returnValues[0]);
  const decimals = 18;
  const fxsPrice = await llamaService
    .getPrice(tokenAddress)
    .then((x) => numToBigNumber(x.price, decimals))
    .catch(() => 0);
  const dec = BigNumber.from(10).pow(decimals);

  const tvl = tvl_tkn.add(tvl_atkn.mul(oracle_price).div(dec));
  const tvl_dollars = tvl.mul(fxsPrice).div(dec);
  const lp_price = tvl_dollars.mul(dec).div(supply);

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
