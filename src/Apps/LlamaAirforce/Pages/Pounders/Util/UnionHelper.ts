import { type UnionVaultUCrv } from "@/Contracts";
import { bigNumToNumber } from "@/Util";
import {
  type Vault as VaultEthers,
  getTotalUnderlying,
} from "@Pounders/Models";

import { type abi as abiUnionVault } from "@/ABI/Union/UnionVault";
import { type abi as abiUnionVaultUCrv } from "@/ABI/Union/UnionVaultUCrv";
import { type abi as abiUnionPirex } from "@/ABI/Union/UnionVaultPirex";
import { type PublicClient, type GetContractReturnType } from "viem";

type VaultUnion = GetContractReturnType<typeof abiUnionVault, PublicClient>;
type VaultUnionUCrv = GetContractReturnType<
  typeof abiUnionVaultUCrv,
  PublicClient
>;
type VaultPirex = GetContractReturnType<typeof abiUnionPirex, PublicClient>;
type Vault = VaultUnionUCrv | VaultUnion | VaultPirex;

export function isPirex(vault: Vault): vault is VaultPirex {
  return vault.abi.some((x) => x.name === "totalAssets");
}

export function getTotalUnderlyingViem(utkn: Vault) {
  return isPirex(utkn) ? utkn.read.totalAssets() : utkn.read.totalUnderlying();
}

export async function getVirtualPriceViem(utkn: Vault): Promise<number> {
  const dec = 10n ** 18n;
  const totalUnderlying = await getTotalUnderlyingViem(utkn);
  const tvl = await utkn.read.totalSupply();

  return tvl > 0n ? bigNumToNumber((totalUnderlying * dec) / tvl, 18n) : 1;
}

export async function getVirtualPrice(
  utkn: VaultEthers | UnionVaultUCrv
): Promise<number> {
  const dec = 10n ** 18n;
  const totalUnderlying = await getTotalUnderlying(utkn);
  const tvl = await utkn.totalSupply().then((x) => x.toBigInt());

  return tvl > 0n ? bigNumToNumber((totalUnderlying * dec) / tvl, 18n) : 1;
}
