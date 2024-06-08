import { type PublicClient } from "viem";
import { type JsonRpcSigner } from "@ethersproject/providers";
import {
  ERC20__factory,
  MerkleDistributor2__factory,
  type UnionVault,
  UnionVault__factory,
} from "@/Contracts";
import { getCvxCrvPriceViem, getCvxCrvApy } from "@/Util";
import {
  CvxCrvAddress,
  DistributorUCrvAddress,
  UnionCrvVaultAddress,
} from "@/Util/Addresses";
import { type DefiLlamaService } from "@/Services";
import { type Pounder } from "@Pounders/Models";

import logo from "@/Assets/Icons/Tokens/crv.svg";

export default function createCrvPounder(
  signer: JsonRpcSigner,
  client: PublicClient,
  llamaService: DefiLlamaService
): Pounder<UnionVault> {
  const utkn = UnionVault__factory.connect(UnionCrvVaultAddress, signer);
  const atkn = ERC20__factory.connect(CvxCrvAddress, signer);
  const distributor = MerkleDistributor2__factory.connect(
    DistributorUCrvAddress,
    signer
  );

  const getPriceUnderlying = () => getCvxCrvPriceViem(llamaService, client);
  const getApy = () => getCvxCrvApy(client, llamaService);

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
    lp: null,
  };
}
