import { getContract } from "viem";
import { type Config } from "@wagmi/core";
import { abi as abiUnionVault } from "@/ABI/Union/UnionVault";
import { abi as abiUnionVaultPirex } from "@/ABI/Union/UnionVaultPirex";
import { type DefiLlamaService } from "@/Services";
import { bigNumToNumber } from "@/Util";
import {
  getCvxCrvPrice,
  getCvxFxsPrice,
  getCvxPrismaPrice,
  getPxCvxPrice,
} from "@/Util/PriceHelper";
import {
  UnionCrvVaultAddress,
  DistributorUCrvAddress,
  UnionFxsVaultAddress,
  DistributorUFxsAddress,
  UnionPrismaVaultAddress,
  DistributorUPrismaAddress,
  UnionCvxVaultAddress,
  DistributorUCvxAddress,
} from "@/Util/Addresses";
import { getVirtualPrice } from "@Pounders/Models";
import { type AirdropId, type Claim } from "@LAF/Services/UnionService";

export type Airdrop = {
  id: AirdropId;
  tkn: string;
  utkn: string;
  claim: Claim;
  amount: bigint;
  amountAsset: number;
  amountDollar: number;
  distributorAddress: `0x${string}`;
};

export type AirdropUCrv = Airdrop & {
  id: "union";
  tkn: "cvxCRV";
  utkn: "uCRV";
};

export type AirdropUFxs = Airdrop & {
  id: "ufxs";
  tkn: "cvxFXS";
  utkn: "uFXS";
};

export type AirdropUPrisma = Airdrop & {
  id: "uprisma";
  tkn: "cvxPRISMA";
  utkn: "uPRISMA";
};

export type AirdropUCvx = Airdrop & {
  id: "ucvx";
  tkn: "pxCVX";
  utkn: "uCVX";
};

export function isAirdropUCrv(airdrop: Airdrop): airdrop is AirdropUCrv {
  return airdrop.tkn === "cvxCRV" && airdrop.utkn === "uCRV";
}

export function isAirdropUFxs(airdrop: Airdrop): airdrop is AirdropUFxs {
  return airdrop.tkn === "cvxFXS" && airdrop.utkn === "uFXS";
}

export function isAirdropUPrisma(airdrop: Airdrop): airdrop is AirdropUPrisma {
  return airdrop.tkn === "cvxPRISMA" && airdrop.utkn === "uPRISMA";
}

export function isAirdropUCvx(airdrop: Airdrop): airdrop is AirdropUCvx {
  return airdrop.tkn === "pxCVX" && airdrop.utkn === "uCVX";
}

export async function uCrvAirdrop(
  config: Config,
  llamaService: DefiLlamaService,
  claim: Claim | undefined
): Promise<AirdropUCrv> {
  const cvxCrvPrice = await getCvxCrvPrice(llamaService, config);

  const utkn = getContract({
    abi: abiUnionVault,
    address: UnionCrvVaultAddress,
    client: config.getClient(),
  });
  const virtualPrice = await getVirtualPrice(utkn);

  claim = claim ?? { index: 0n, amount: "0x0", proof: [] };
  const amount = BigInt(claim.amount);
  const amountAsset = virtualPrice * bigNumToNumber(amount, 18n);
  const amountDollar = amountAsset * cvxCrvPrice;

  return {
    id: "union",
    tkn: "cvxCRV",
    utkn: "uCRV",
    claim,
    amount,
    amountAsset,
    amountDollar,
    distributorAddress: DistributorUCrvAddress,
  };
}

export async function uFxsAirdrop(
  config: Config,
  llamaService: DefiLlamaService,
  claim: Claim | undefined
): Promise<AirdropUFxs> {
  const cvxFxsPrice = await getCvxFxsPrice(llamaService, config);

  const utkn = getContract({
    abi: abiUnionVault,
    address: UnionFxsVaultAddress,
    client: config.getClient(),
  });
  const virtualPrice = await getVirtualPrice(utkn);

  claim = claim ?? { index: 0n, amount: "0x0", proof: [] };
  const amount = BigInt(claim?.amount ?? 0);
  const amountAsset = virtualPrice * bigNumToNumber(amount, 18n);
  const amountDollar = amountAsset * cvxFxsPrice;

  return {
    id: "ufxs",
    tkn: "cvxFXS",
    utkn: "uFXS",
    claim,
    amount,
    amountAsset,
    amountDollar,
    distributorAddress: DistributorUFxsAddress,
  };
}

export async function uPrismaAirdrop(
  config: Config,
  llamaService: DefiLlamaService,
  claim: Claim | undefined
): Promise<AirdropUPrisma> {
  const cvxPrismaPrice = await getCvxPrismaPrice(llamaService, config);

  const utkn = getContract({
    abi: abiUnionVault,
    address: UnionPrismaVaultAddress,
    client: config.getClient(),
  });
  const virtualPrice = await getVirtualPrice(utkn);

  claim = claim ?? { index: 0n, amount: "0x0", proof: [] };
  const amount = BigInt(claim?.amount ?? 0);
  const amountAsset = virtualPrice * bigNumToNumber(amount, 18n);
  const amountDollar = amountAsset * cvxPrismaPrice;

  return {
    id: "uprisma",
    tkn: "cvxPRISMA",
    utkn: "uPRISMA",
    claim,
    amount,
    amountAsset,
    amountDollar,
    distributorAddress: DistributorUPrismaAddress,
  };
}

export async function uCvxAirdrop(
  config: Config,
  llamaService: DefiLlamaService,
  claim: Claim | undefined
): Promise<AirdropUCvx> {
  const pxCvxPrice = await getPxCvxPrice(llamaService, config);

  const utkn = getContract({
    abi: abiUnionVaultPirex,
    address: UnionCvxVaultAddress,
    client: config.getClient(),
  });
  const virtualPrice = await getVirtualPrice(utkn);

  claim = claim ?? { index: 0n, amount: "0x0", proof: [] };
  const amount = BigInt(claim.amount);
  const amountAsset = virtualPrice * bigNumToNumber(amount, 18n);
  const amountDollar = amountAsset * pxCvxPrice;

  return {
    id: "ucvx",
    tkn: "pxCVX",
    utkn: "uCVX",
    claim,
    amount,
    amountAsset,
    amountDollar,
    distributorAddress: DistributorUCvxAddress,
  };
}
