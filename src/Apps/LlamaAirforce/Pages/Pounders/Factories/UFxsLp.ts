import { type JsonRpcSigner } from "@ethersproject/providers";
import {
  CurveV2FactoryPool__factory,
  ERC20__factory,
  MerkleDistributor2__factory,
  type UnionVault,
  UnionVault__factory,
} from "@/Contracts";
import { getCvxFxsLpPrice, getCvxFxsLpApy, bigNumToNumber } from "@/Util";
import {
  CvxFxsAddress,
  CvxFxsFactoryAddress,
  DistributorUFxsAddressV1,
  UnionFxsVaultAddressV1,
} from "@/Util/Addresses";
import { type DefiLlamaService } from "@/Services";
import { type Pounder } from "@Pounders/Models/Pounder";

import logo from "@/Assets/Icons/Tokens/cvxfxs.png";

export default function createFxsLpPounder(
  signer: JsonRpcSigner,
  llamaService: DefiLlamaService
): Pounder<UnionVault> {
  const utkn = UnionVault__factory.connect(UnionFxsVaultAddressV1, signer);
  const atkn = ERC20__factory.connect(CvxFxsAddress, signer);
  const distributor = MerkleDistributor2__factory.connect(
    DistributorUFxsAddressV1,
    signer
  );

  const getPriceUnderlying = () =>
    getCvxFxsLpPrice(llamaService, signer.provider);

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
    atkn,
    distributor: () => distributor,
    getPriceUnderlying,
    getApy,
    lp: {
      symbolPrimary: "FXS",
      getOraclePrice,
    },
  };
}
