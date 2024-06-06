import { type JsonRpcSigner } from "@ethersproject/providers";
import { maxApprove } from "@/Wallet";
import {
  type ERC20,
  ERC20__factory,
  ZapsUPrismaConvexMigration__factory,
  type UnionVault,
} from "@/Contracts";
import {
  ZapsUPrismaConvexMigrationAddress,
  StkCvxPrismaAddress,
} from "@/Util/Addresses";
import type { ZapDeposit, Swap } from "@Pounders/Models";

import logoPRISMA from "@/Assets/Icons/Tokens/prisma.svg";

// eslint-disable-next-line max-lines-per-function
export function uPrismaDepositZaps(
  getSigner: () => JsonRpcSigner | undefined,
  getAddress: () => string | undefined,
  getInput: () => bigint | null,
  getVault: () => UnionVault | undefined,
  getAssetTkn: () => ERC20 | undefined
): (ZapDeposit | Swap)[] {
  const deposit = async () => {
    const address = getAddress();
    const vault = getVault();
    const input = getInput();
    const atkn = getAssetTkn();

    if (!address || !vault || !input || !atkn) {
      throw new Error("Unable to construct deposit zaps");
    }

    await maxApprove(atkn, address, vault.address, input);

    const ps = [address, input] as const;
    const estimate = await vault.estimateGas.deposit(...ps);
    const tx = await vault.deposit(...ps, {
      gasLimit: estimate.mul(125).div(100),
    });

    return tx.wait();
  };

  const depositFromStkCvxPrisma = async () => {
    const address = getAddress();
    const input = getInput();
    const signer = getSigner();

    if (!address || !input || !signer) {
      throw new Error("Unable to construct migration zap");
    }

    const stkCvxPrisma = ERC20__factory.connect(StkCvxPrismaAddress, signer);
    await maxApprove(
      stkCvxPrisma,
      address,
      ZapsUPrismaConvexMigrationAddress,
      input
    );

    const zap = ZapsUPrismaConvexMigration__factory.connect(
      ZapsUPrismaConvexMigrationAddress,
      signer
    );

    const ps = [input, address] as const;

    const estimate = await zap.estimateGas.migrate(...ps);

    const tx = await zap.migrate(...ps, {
      gasLimit: estimate.mul(125).div(100),
    });

    return tx.wait();
  };

  // Zaps
  const stkCvxPrisma: ZapDeposit = {
    logo: logoPRISMA,
    label: "Migrate from Convex",
    zap: () => depositFromStkCvxPrisma(),
    depositSymbol: "stkCvxPRISMA",
    depositBalance: () => {
      const address = getAddress();
      const provider = getSigner()?.provider;

      if (!address || !provider) {
        throw new Error("Unable to construct deposit zap balance");
      }

      const depositERC20 = ERC20__factory.connect(
        StkCvxPrismaAddress,
        provider
      );
      return depositERC20.balanceOf(address).then((x) => x.toBigInt());
    },
    depositDecimals: () => {
      const provider = getSigner()?.provider;

      if (!provider) {
        throw new Error("Unable to construct deposit zap decimals");
      }

      const depositERC20 = ERC20__factory.connect(
        StkCvxPrismaAddress,
        provider
      );
      return depositERC20.decimals().then((x) => BigInt(x));
    },
  };

  const cvxPRISMA: ZapDeposit = {
    logo: logoPRISMA,
    label: "cvxPRISMA",
    zap: () => deposit(),
    depositSymbol: "cvxPRISMA",
    depositBalance: async () => {
      const address = getAddress();
      const atkn = getAssetTkn();

      if (!address || !atkn) {
        throw new Error("Unable to construct deposit zap balance");
      }

      return await atkn.balanceOf(address).then((x) => x.toBigInt());
    },
    depositDecimals: async () => {
      const atkn = getAssetTkn();

      if (!atkn) {
        throw new Error("Unable to construct deposit zap decimals");
      }

      return await atkn.decimals().then((x) => BigInt(x));
    },
  };

  const swap: Swap = {
    buy: "cvxPRISMA",
    sell: "ETH",
  };

  const options = [stkCvxPrisma, cvxPRISMA, swap];

  return options;
}
