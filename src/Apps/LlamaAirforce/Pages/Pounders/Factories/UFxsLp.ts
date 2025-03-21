import { abi as abiCurveV2 } from "@/ABI/Curve/CurveV2FactoryPool";
import { abi } from "@/ABI/Union/UnionVault";
import logo from "@/Assets/Icons/Tokens/cvxfxs.png";
import type { PriceService } from "@/Services";
import { getCvxFxsLpApy } from "@/Utils/Apy";
import { bigNumToNumber } from "@/Utils/Number";
import { getCvxFxsLpPrice } from "@/Utils/Price";
import type { VaultUnion, Pounder } from "@Pounders/Models";

export default function createFxsLpPounder(
  config: Config,
  priceService: PriceService
): Pounder<VaultUnion> {
  const client = getPublicClient(config);
  if (!client) throw Error("Cannot create public viem client");

  const getPriceUnderlying = () => getCvxFxsLpPrice(priceService, client);
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
    client,
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
