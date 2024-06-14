import { getContract } from "viem";
import { type Config, readContract } from "@wagmi/core";
import { abi } from "@/ABI/Union/UnionVault";
import { abi as abiCurveV2 } from "@/ABI/Curve/CurveV2FactoryPool";
import { getCvxFxsLpPrice, getCvxFxsLpApy, bigNumToNumber } from "@/Util";
import {
  CvxFxsAddress,
  CvxFxsFactoryAddress,
  DistributorUFxsAddressV1,
  UnionFxsVaultAddressV1,
} from "@/Util/Addresses";
import { type DefiLlamaService } from "@/Services";
import { type VaultUnion, type Pounder } from "@Pounders/Models";

import logo from "@/Assets/Icons/Tokens/cvxfxs.png";

export default function createFxsLpPounder(
  config: Config,
  llamaService: DefiLlamaService
): Pounder<VaultUnion> {
  const getPriceUnderlying = () => getCvxFxsLpPrice(llamaService, config);
  const getApy = () => getCvxFxsLpApy();

  const getOraclePrice = () =>
    readContract(config, {
      abi: abiCurveV2,
      address: CvxFxsFactoryAddress,
      functionName: "price_oracle",
    }).then((price) => bigNumToNumber(price, 18n));

  const contract = getContract({
    abi,
    address: UnionFxsVaultAddressV1,
    client: config.getClient(),
  });

  return {
    id: "ufxslp",
    name: "Frax LP",
    logo,
    symbol: "cvxFXSFXS-f",
    description: "description-ufxslp",
    asset: CvxFxsAddress,
    contract,
    distributor: DistributorUFxsAddressV1,
    getPriceUnderlying,
    getApy,
    lp: {
      symbolPrimary: "FXS",
      getOraclePrice,
    },
  };
}
