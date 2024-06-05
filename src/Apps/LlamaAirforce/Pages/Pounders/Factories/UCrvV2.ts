import { type JsonRpcSigner } from "@ethersproject/providers";
import {
  CurveV1FactoryPool__factory,
  ERC20__factory,
  MerkleDistributor2__factory,
  type UnionVault,
  UnionVault__factory,
} from "@/Contracts";
import { getCvxCrvPriceV2, getCvxCrvApyV2 } from "@/Util";
import {
  CvxCrvAddress,
  CvxCrvFactoryAddressV1,
  DistributorUCrvAddressV2,
  UnionCrvVaultAddressV2,
} from "@/Util/Addresses";
import { type DefiLlamaService } from "@/Services";
import { type Pounder } from "@Pounders/Models";

import logo from "@/Assets/Icons/Tokens/crv.svg";

export default function createCrvV2Pounder(
  signer: JsonRpcSigner,
  llamaService: DefiLlamaService
): Pounder<UnionVault> {
  const utkn = UnionVault__factory.connect(UnionCrvVaultAddressV2, signer);
  const atkn = ERC20__factory.connect(CvxCrvAddress, signer);
  const factory = CurveV1FactoryPool__factory.connect(
    CvxCrvFactoryAddressV1,
    signer
  );
  const distributor = MerkleDistributor2__factory.connect(
    DistributorUCrvAddressV2,
    signer
  );

  const getPriceUnderlying = () => getCvxCrvPriceV2(llamaService, factory);
  const getApy = () => getCvxCrvApyV2(signer, llamaService);

  return {
    id: "ucrv2",
    name: "Curve V2",
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
