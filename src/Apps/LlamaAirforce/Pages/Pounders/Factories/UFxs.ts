import { type JsonRpcSigner } from "@ethersproject/providers";
import {
  CurveV2FactoryPool__factory,
  ERC20__factory,
  MerkleDistributor2__factory,
  type UnionVault,
  UnionVault__factory,
} from "@/Contracts";
import { getCvxFxsPrice, getCvxFxsApy } from "@/Util";
import {
  CvxFxsAddress,
  CvxFxsFactoryAddress,
  DistributorUFxsAddress,
  UnionFxsVaultAddress,
} from "@/Util/Addresses";
import { type DefiLlamaService } from "@/Services";
import { type Pounder } from "@Pounders/Models/Pounder";

import logo from "@/Assets/Icons/Tokens/cvxfxs.png";

export default function createFxsPounder(
  signer: JsonRpcSigner,
  llamaService: DefiLlamaService
): Pounder<UnionVault> {
  const utkn = UnionVault__factory.connect(UnionFxsVaultAddress, signer);
  const atkn = ERC20__factory.connect(CvxFxsAddress, signer);
  const factory = CurveV2FactoryPool__factory.connect(
    CvxFxsFactoryAddress,
    signer
  );
  const distributor = MerkleDistributor2__factory.connect(
    DistributorUFxsAddress,
    signer
  );

  const getPriceUnderlying = () => getCvxFxsPrice(llamaService, factory);
  const getApy = () => getCvxFxsApy(signer, llamaService);

  return {
    id: "ufxs",
    name: "Frax",
    logo,
    symbol: "cvxFXS",
    description: "description-ufxs",
    utkn,
    atkn,
    distributor: () => distributor,
    getPriceUnderlying,
    getApy,
    swapSymbols: {
      buy: "cvxFXS",
      sell: "ETH",
    },
    lp: null,
  };
}
