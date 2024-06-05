import { getProvider } from "@/Wallet/ProviderFactory";
import { type UnionVault, UnionVault__factory } from "@/Contracts";
import { UnionFxsVaultAddress } from "@/Util/Addresses";
import { type ZapWithdraw } from "@Pounders/Models/Zap";

import logoFXS from "@/Assets/Icons/Tokens/fxs.png";

// eslint-disable-next-line max-lines-per-function
export function uFxsWithdrawZaps(
  getAddress: () => string | undefined,
  getInput: () => bigint | null,
  getVault: () => UnionVault | undefined
): ZapWithdraw[] {
  const withdraw = async () => {
    const address = getAddress();
    const vault = getVault();
    const input = getInput();
    const provider = getProvider();

    if (!address || !vault || !input || !provider) {
      throw new Error("Unable to construct extra withdraw zaps");
    }

    const signer = provider.getSigner();
    const utkn = UnionVault__factory.connect(UnionFxsVaultAddress, signer);

    const ps = [address, input] as const;
    const estimate = await utkn.estimateGas.withdraw(...ps);
    const tx = await utkn.withdraw(...ps, {
      gasLimit: estimate.mul(125).div(100),
    });

    return tx.wait();
  };

  // Zaps
  const cvxFXS: ZapWithdraw = {
    logo: logoFXS,
    label: "cvxFXS",
    withdrawSymbol: "cvxFXS",
    withdrawDecimals: () => Promise.resolve(18n),
    zap: () => withdraw(),
  };

  const options = [cvxFXS];

  return options;
}
