import { cache } from "@/Framework/Hono";
import { useCosmosDb } from "@LAF/Server/util/useCosmosDb";
import type { AirdropId } from "@LAF/Services/UnionService";

/** Copy pasted from Union script for now, no shared .ts file. */
type MerkleDistributorInfo = { id: string } & {
  merkleRoot: string;
  tokenTotal: string;
  claims: {
    [account: string]: {
      index: number;
      amount: string;
      proof: string[];
      flags?: {
        [flag: string]: boolean;
      };
    };
  };
};

// Cache prefix key.
export const GET_AIRDROP_CLAIM = "airdropClaims";

export const getAirdropClaims = async (airdropId: AirdropId) =>
  cache(
    `${GET_AIRDROP_CLAIM}:${airdropId}`,
    async () => {
      const { getItem } = useCosmosDb("Airdrops");
      return getItem<MerkleDistributorInfo>(airdropId);
    },
    { ttl: 1000 * 60 * 60 * 24 * 14 } // 14 days
  );
