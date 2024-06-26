import { type Address } from "viem";
import { ServiceBaseHost } from "@/Services";

export type Claim = {
  index: bigint;
  amount: string; // In hex because of big numbers.
  proof: Readonly<Address[]>;
};

type ClaimResponse = {
  success: boolean;
  claim: Claim;
};

export type AirdropId = "union" | "ufxs" | "ucvx" | "uprisma" | "cvxprisma";

export default class UnionService extends ServiceBaseHost {
  public async getClaim(
    airdropId: AirdropId,
    address: string
  ): Promise<ClaimResponse> {
    const host = await this.getHost();

    return this.fetch(`${host}/airdrop`, {
      airdropId,
      address,
    });
  }
}
