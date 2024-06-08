import { type PublicClient } from "viem";
import { type JsonRpcSigner } from "@ethersproject/providers";
import {
  ERC20__factory,
  MerkleDistributor2__factory,
  type UnionVault,
  UnionVault__factory,
} from "@/Contracts";
import { getCvxFxsPriceViem, getCvxFxsApy } from "@/Util";
import {
  CvxFxsAddress,
  DistributorUFxsAddress,
  UnionFxsVaultAddress,
} from "@/Util/Addresses";
import { type DefiLlamaService } from "@/Services";
import { type Pounder } from "@Pounders/Models";

import logo from "@/Assets/Icons/Tokens/cvxfxs.png";

export default function createFxsPounder(
  signer: JsonRpcSigner,
  client: PublicClient,
  llamaService: DefiLlamaService
): Pounder<UnionVault> {
  const utkn = UnionVault__factory.connect(UnionFxsVaultAddress, signer);
  const atkn = ERC20__factory.connect(CvxFxsAddress, signer);
  const distributor = MerkleDistributor2__factory.connect(
    DistributorUFxsAddress,
    signer
  );

  const getPriceUnderlying = () => getCvxFxsPriceViem(llamaService, client);
  const getApy = () => getCvxFxsApy(client, llamaService);

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
    lp: null,
  };
}
