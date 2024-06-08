import { type PublicClient, getContract } from "viem";
import { type JsonRpcSigner } from "@ethersproject/providers";
import {
  ERC20__factory,
  type UnionVault,
  UnionVault__factory,
} from "@/Contracts";
import { abi } from "@/ABI/Union/UnionVault";
import { getCvxCrvPriceV2Viem, getCvxCrvApyV2 } from "@/Util";
import {
  CvxCrvAddress,
  DistributorUCrvAddressV2,
  UnionCrvVaultAddressV2,
} from "@/Util/Addresses";
import { type DefiLlamaService } from "@/Services";
import { type VaultUnion, type Pounder } from "@Pounders/Models";

import logo from "@/Assets/Icons/Tokens/crv.svg";

export default function createCrvV2Pounder(
  signer: JsonRpcSigner,
  client: PublicClient,
  llamaService: DefiLlamaService
): Pounder<UnionVault, VaultUnion> {
  const utkn = UnionVault__factory.connect(UnionCrvVaultAddressV2, signer);
  const atkn = ERC20__factory.connect(CvxCrvAddress, signer);

  const getPriceUnderlying = () => getCvxCrvPriceV2Viem(llamaService, client);
  const getApy = () => getCvxCrvApyV2(client, llamaService);

  const contract = getContract({
    abi,
    address: UnionCrvVaultAddressV2,
    client,
  });

  return {
    id: "ucrv2",
    name: "Curve V2",
    logo,
    symbol: "cvxCRV",
    description: "description-ucrv",
    utkn,
    uTknAddress: UnionCrvVaultAddressV2,
    atkn,
    aTknAddress: CvxCrvAddress,
    contract,
    distributor: DistributorUCrvAddressV2,
    getPriceUnderlying,
    getApy,
    lp: null,
  };
}
