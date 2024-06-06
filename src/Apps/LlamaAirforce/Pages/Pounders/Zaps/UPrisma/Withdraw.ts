import { getSigner } from "@/Wallet/ProviderFactory";
import { type UnionVault, UnionVault__factory } from "@/Contracts";
import { UnionPrismaVaultAddress } from "@/Util/Addresses";
import type { ZapWithdraw, Swap } from "@Pounders/Models";

import logoPRISMA from "@/Assets/Icons/Tokens/prisma.svg";

export function uPrismaWithdrawZaps(
  getAddress: () => string | undefined,
  getInput: () => bigint | null,
  getVault: () => UnionVault | undefined
): (ZapWithdraw | Swap)[] {
  const withdraw = async () => {
    const address = getAddress();
    const vault = getVault();
    const input = getInput();
    const signer = await getSigner();

    if (!address || !vault || !input || !signer) {
      throw new Error("Unable to construct extra withdraw zaps");
    }

    const utkn = UnionVault__factory.connect(UnionPrismaVaultAddress, signer);

    const ps = [address, input] as const;
    const estimate = await utkn.estimateGas.withdraw(...ps);
    const tx = await utkn.withdraw(...ps, {
      gasLimit: estimate.mul(125).div(100),
    });

    return tx.wait();
  };

  // Zaps
  const cvxPRISMA: ZapWithdraw = {
    logo: logoPRISMA,
    label: "cvxPRISMA",
    withdrawSymbol: "cvxPRISMA",
    withdrawDecimals: () => Promise.resolve(18n),
    zap: () => withdraw(),
  };

  const swap: Swap = {
    buy: "ETH",
    sell: "cvxPRISMA",
  };

  const options = [cvxPRISMA, swap];

  return options;
}
