import { getContract, type PublicClient } from "viem";
import { type JsonRpcSigner } from "@ethersproject/providers";
import {
  ERC20__factory,
  type UnionVault,
  UnionVault__factory,
} from "@/Contracts";
import { getCvxCrvPriceViem, getCvxCrvApy } from "@/Util";
import { abi } from "@/ABI/Union/UnionVault";
import {
  CvxCrvAddress,
  DistributorUCrvAddress,
  UnionCrvVaultAddress,
} from "@/Util/Addresses";
import { type DefiLlamaService } from "@/Services";
import { type VaultUnion, type Pounder } from "@Pounders/Models";

import logo from "@/Assets/Icons/Tokens/crv.svg";

export default function createCrvPounder(
  signer: JsonRpcSigner,
  client: PublicClient,
  llamaService: DefiLlamaService
): Pounder<UnionVault, VaultUnion> {
  const utkn = UnionVault__factory.connect(UnionCrvVaultAddress, signer);
  const atkn = ERC20__factory.connect(CvxCrvAddress, signer);

  const getPriceUnderlying = () => getCvxCrvPriceViem(llamaService, client);
  const getApy = () => getCvxCrvApy(client, llamaService);

  const contract = getContract({
    abi,
    address: UnionCrvVaultAddress,
    client,
  });

  return {
    id: "ucrv",
    name: "Curve",
    logo,
    symbol: "cvxCRV",
    description: "description-ucrv",
    utkn,
    uTknAddress: UnionCrvVaultAddress,
    atkn,
    aTknAddress: CvxCrvAddress,
    contract,
    distributor: DistributorUCrvAddress,
    getPriceUnderlying,
    getApy,
    lp: null,
  };
}
