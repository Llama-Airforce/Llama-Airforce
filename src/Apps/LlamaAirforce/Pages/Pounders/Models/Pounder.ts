import {
  type Address,
  type PublicClient,
  type GetContractReturnType,
} from "viem";
import { type abi as abiUnionVault } from "@/ABI/Union/UnionVault";
import { type abi as abiUnionPirex } from "@/ABI/Union/UnionVaultPirex";
import { bigNumToNumber } from "@/Util";

export type VaultUnion = GetContractReturnType<
  typeof abiUnionVault,
  PublicClient
>;
export type VaultPirex = GetContractReturnType<
  typeof abiUnionPirex,
  PublicClient
>;
export type Vault = VaultUnion | VaultPirex;

export function isPirex(vault: Vault): vault is VaultPirex {
  return vault.abi.some((x) => x.name === "totalAssets");
}

export function getTotalUnderlying(utkn: Vault) {
  return isPirex(utkn) ? utkn.read.totalAssets() : utkn.read.totalUnderlying();
}

export async function getVirtualPrice(utkn: Vault): Promise<number> {
  const dec = 10n ** 18n;
  const totalUnderlying = await getTotalUnderlying(utkn);
  const tvl = await utkn.read.totalSupply();

  return tvl > 0n ? bigNumToNumber((totalUnderlying * dec) / tvl, 18n) : 1;
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

export type Pounder<Contract extends Vault> = {
  id: PounderId;
  name: string;
  logo: string;
  symbol: string;
  description: string;
  contract: Contract;
  asset: Address;
  distributor?: Address;
  lp: PounderLp | null;
  getPriceUnderlying: () => Promise<number>;
  getApy: () => Promise<number>;
};
