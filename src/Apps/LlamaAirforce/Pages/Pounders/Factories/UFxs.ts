import { type PublicClient, getContract } from "viem";
import { type JsonRpcSigner } from "@ethersproject/providers";
import {
  ERC20__factory,
  type UnionVault,
  UnionVault__factory,
} from "@/Contracts";
import { abi } from "@/ABI/Union/UnionVault";
import { getCvxFxsPriceViem, getCvxFxsApy } from "@/Util";
import {
  CvxFxsAddress,
  DistributorUFxsAddress,
  UnionFxsVaultAddress,
} from "@/Util/Addresses";
import { type DefiLlamaService } from "@/Services";
import { type VaultUnion, type Pounder } from "@Pounders/Models";

import logo from "@/Assets/Icons/Tokens/cvxfxs.png";

export default function createFxsPounder(
  signer: JsonRpcSigner,
  client: PublicClient,
  llamaService: DefiLlamaService
): Pounder<UnionVault, VaultUnion> {
  const utkn = UnionVault__factory.connect(UnionFxsVaultAddress, signer);
  const atkn = ERC20__factory.connect(CvxFxsAddress, signer);

  const getPriceUnderlying = () => getCvxFxsPriceViem(llamaService, client);
  const getApy = () => getCvxFxsApy(client, llamaService);

  const contract = getContract({
    abi,
    address: UnionFxsVaultAddress,
    client,
  });

  return {
    id: "ufxs",
    name: "Frax",
    logo,
    symbol: "cvxFXS",
    description: "description-ufxs",
    utkn,
    uTknAddress: UnionFxsVaultAddress,
    atkn,
    aTknAddress: CvxFxsAddress,
    contract,
    distributor: DistributorUFxsAddress,
    getPriceUnderlying,
    getApy,
    lp: null,
  };
}
