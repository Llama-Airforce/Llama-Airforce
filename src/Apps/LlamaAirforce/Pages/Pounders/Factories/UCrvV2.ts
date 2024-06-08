import { type PublicClient } from "viem";
import { type JsonRpcSigner } from "@ethersproject/providers";
import {
  ERC20__factory,
  MerkleDistributor2__factory,
  type UnionVault,
  UnionVault__factory,
} from "@/Contracts";
import { getCvxCrvPriceV2Viem, getCvxCrvApyV2 } from "@/Util";
import {
  CvxCrvAddress,
  DistributorUCrvAddressV2,
  UnionCrvVaultAddressV2,
} from "@/Util/Addresses";
import { type DefiLlamaService } from "@/Services";
import { type Pounder } from "@Pounders/Models";

import logo from "@/Assets/Icons/Tokens/crv.svg";

export default function createCrvV2Pounder(
  signer: JsonRpcSigner,
  client: PublicClient,
  llamaService: DefiLlamaService
): Pounder<UnionVault> {
  const utkn = UnionVault__factory.connect(UnionCrvVaultAddressV2, signer);
  const atkn = ERC20__factory.connect(CvxCrvAddress, signer);
  const distributor = MerkleDistributor2__factory.connect(
    DistributorUCrvAddressV2,
    signer
  );

  const getPriceUnderlying = () => getCvxCrvPriceV2Viem(llamaService, client);
  const getApy = () => getCvxCrvApyV2(client, llamaService);

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
    lp: null,
  };
}
