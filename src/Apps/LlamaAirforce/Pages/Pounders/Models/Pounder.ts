import type {
  ERC20,
  MerkleDistributor2,
  UnionVault,
  UnionVaultPirex,
  UnionVaultUCrv,
} from "@/Contracts";

export type Vault = UnionVault | UnionVaultPirex;

export function isPirex(
  vault: Vault | UnionVaultUCrv
): vault is UnionVaultPirex {
  return "totalAssets()" in vault;
}

export function getTotalUnderlying(
  vault: Vault | UnionVaultUCrv
): Promise<bigint> {
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

export type Pounder<V extends Vault> = {
  id: PounderId;
  name: string;
  logo: string;
  symbol: string;
  description: string;
  utkn: V;
  atkn: ERC20;
  distributor: () => MerkleDistributor2 | null;
  lp: PounderLp | null;
  swapSymbols: {
    buy: string;
    sell: string;
  };

  getPriceUnderlying: () => Promise<number>;
  getApy: () => Promise<number>;
};
