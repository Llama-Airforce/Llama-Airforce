import { ServiceBase } from "@/Services";

export type Claim = {
  index: number;
  amount: string; // In hex because of big numbers.
  proof: string[];
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
