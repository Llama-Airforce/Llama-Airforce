import { type Address } from "viem";
import type { ERC20, UnionVault, UnionVaultPirex } from "@/Contracts";
import { type abi as abiUnionVault } from "@/ABI/Union/UnionVault";
import { type abi as abiUnionPirex } from "@/ABI/Union/UnionVaultPirex";

import { type PublicClient, type GetContractReturnType } from "viem";

export type VaultUnion = GetContractReturnType<
  typeof abiUnionVault,
  PublicClient
>;
export type VaultPirex = GetContractReturnType<
  typeof abiUnionPirex,
  PublicClient
>;

export type VaultViem = VaultUnion | VaultPirex;
export type Vault = UnionVault | UnionVaultPirex;

export function isPirex(vault: Vault): vault is UnionVaultPirex {
  return "totalAssets()" in vault;
}

export function getTotalUnderlying(vault: Vault): Promise<bigint> {
  if (isPirex(vault)) {
    return vault.totalAssets().then((x) => x.toBigInt());
  } else {
    return vault.totalUnderlying().then((x) => x.toBigInt());
  }
}

/** Is the pounder underlying asset an LP? Then we provide additional breakdown features. */
export type PounderLp = {
  symbolPrimary: string;
  getOraclePrice(): Promise<number>;
};

const pounderIds = [
  "ucrv",
  "ufxs",
  "ucvx",
  "uprisma",
  "ubal",
  "ufxslp",
  "ucrv2",
] as const;

export type PounderId = (typeof pounderIds)[number];

export type Pounder<V extends Vault, V2 extends VaultViem> = {
  id: PounderId;
  name: string;
  logo: string;
  symbol: string;
  description: string;
  uTknAddress: Address;
  aTknAddress: Address;
  contract: V2;
  utkn: V;
  atkn: ERC20;
  distributor?: Address;
  lp: PounderLp | null;
  getPriceUnderlying: () => Promise<number>;
  getApy: () => Promise<number>;
};
