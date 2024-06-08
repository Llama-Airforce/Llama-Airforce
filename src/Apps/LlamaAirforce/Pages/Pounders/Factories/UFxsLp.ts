import { type PublicClient, getContract } from "viem";
import { type JsonRpcSigner } from "@ethersproject/providers";
import {
  CurveV2FactoryPool__factory,
  ERC20__factory,
  type UnionVault,
  UnionVault__factory,
} from "@/Contracts";
import { abi } from "@/ABI/Union/UnionVault";
import { getCvxFxsLpPriceViem, getCvxFxsLpApy, bigNumToNumber } from "@/Util";
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
  signer: JsonRpcSigner,
  client: PublicClient,
  llamaService: DefiLlamaService
): Pounder<UnionVault, VaultUnion> {
  const utkn = UnionVault__factory.connect(UnionFxsVaultAddressV1, signer);
  const atkn = ERC20__factory.connect(CvxFxsAddress, signer);

  const contract = getContract({
    abi,
    address: UnionFxsVaultAddressV1,
    client,
  });

  const getPriceUnderlying = () => getCvxFxsLpPriceViem(llamaService, client);

  const getApy = () => getCvxFxsLpApy();

  const curvePool = CurveV2FactoryPool__factory.connect(
    CvxFxsFactoryAddress,
    signer
  );

  const getOraclePrice = () =>
    curvePool
      .price_oracle()
      .then((x) => x.toBigInt())
      .then((price) => bigNumToNumber(price, 18n));

  return {
    id: "ufxslp",
    name: "Frax LP",
    logo,
    symbol: "cvxFXSFXS-f",
    description: "description-ufxslp",
    utkn,
    uTknAddress: UnionFxsVaultAddressV1,
    atkn,
    aTknAddress: CvxFxsAddress,
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
