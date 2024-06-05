import { type JsonRpcSigner } from "@ethersproject/providers";
import {
  CvxCrvFactoryPool__factory,
  ERC20__factory,
  MerkleDistributor2__factory,
  type UnionVault,
  UnionVault__factory,
} from "@/Contracts";
import { getCvxCrvPrice, getCvxCrvApy } from "@/Util";
import {
  CvxCrvAddress,
  CvxCrvFactoryAddress,
  DistributorUCrvAddress,
  UnionCrvVaultAddress,
} from "@/Util/Addresses";
import { type DefiLlamaService } from "@/Services";
import { type Pounder } from "@Pounders/Models/Pounder";

import logo from "@/Assets/Icons/Tokens/crv.svg";

export default function createCrvPounder(
  signer: JsonRpcSigner,
  llamaService: DefiLlamaService
): Pounder<UnionVault> {
  const utkn = UnionVault__factory.connect(UnionCrvVaultAddress, signer);
  const atkn = ERC20__factory.connect(CvxCrvAddress, signer);
  const factory = CvxCrvFactoryPool__factory.connect(
    CvxCrvFactoryAddress,
    signer
  );
  const distributor = MerkleDistributor2__factory.connect(
    DistributorUCrvAddress,
    signer
  );

  const getPriceUnderlying = () => getCvxCrvPrice(llamaService, factory);
  const getApy = () => getCvxCrvApy(signer, llamaService);

  return {
    id: "ucrv",
    name: "Curve",
    logo,
    symbol: "cvxCRV",
    description: "description-ucrv",
    utkn,
    atkn,
    distributor: () => distributor,
    getPriceUnderlying,
    getApy,
    swapSymbols: {
      buy: "cvxCRV",
      sell: "ETH",
    },
    lp: null,
  };
}
