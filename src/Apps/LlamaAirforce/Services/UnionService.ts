import { ServiceBase } from "@/Services";

export type Claim = {
  index: bigint;
  amount: string; // In hex because of big numbers.
  proof: Readonly<`0x${string}`[]>;
};

type ClaimResponse = {
  success: boolean;
  claim: Claim;
};

export type AirdropId = "union" | "ufxs" | "ucvx" | "uprisma" | "cvxprisma";

export default class UnionService extends ServiceBase {
  public async getClaim(
    airdropId: AirdropId,
    address: string
  ): Promise<ClaimResponse> {
    return this.fetch(`${this.host}/airdrop`, {
      airdropId,
      address,
    });
  }
}
