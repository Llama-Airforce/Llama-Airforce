import { getAddress } from "viem";
import { ServiceBaseHost } from "@/Services";
import { FetchError } from "@/Utils/fetch";
import type { Result as Claim } from "@LAF/Server/routes/airdrop/[airdropId]/[address].get";
export { type Claim };

export const airdropIds = [
  "union",
  "ufxs",
  "ucvx",
  "uprisma",
  "cvxprisma",
  "scrvusd",
  "sreusd",
] as const;
export type AirdropId = (typeof airdropIds)[number];

export function isAirdropId(id: string): id is AirdropId {
  return airdropIds.includes(id as AirdropId);
}

export default class UnionService extends ServiceBaseHost {
  public async getClaim(
    airdropId: AirdropId,
    address: string
  ): Promise<Claim | null> {
    const host = await this.getHost();

    const addressChecked = getAddress(address);
    try {
      return await this.fetch(`${host}/airdrop/${airdropId}/${addressChecked}`);
    } catch (err) {
      if (err instanceof FetchError) {
        return null;
      } else throw err;
    }
  }
}
