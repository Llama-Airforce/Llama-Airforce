import { type UnionVaultUCrv } from "@/Contracts";
import { bigNumToNumber } from "@/Util";
import { type Vault, getTotalUnderlying } from "@Pounders/Models";

export async function getVirtualPrice(
  utkn: Vault | UnionVaultUCrv
): Promise<number> {
  const dec = 10n ** 18n;
  const totalUnderlying = await getTotalUnderlying(utkn);
  const tvl = await utkn.totalSupply().then((x) => x.toBigInt());

  return tvl > 0n ? bigNumToNumber((totalUnderlying * dec) / tvl, 18n) : 1;
}
