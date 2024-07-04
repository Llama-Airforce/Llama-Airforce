import { type AirdropId } from "@LAF/Services/UnionService";
import { useCosmosDb } from "@LAF/Server/util/useCosmosDb";

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

// Cache key.
export const GET_AIRDROP_CLAIM = "airdropClaims";

export const getAirdropClaims = defineCachedFunction(
  async (airdropId: AirdropId) => {
    const { getItem } = useCosmosDb("Airdrops");
    const airdrop = await getItem<MerkleDistributorInfo>(airdropId);

    return airdrop;
  },
  {
    maxAge: 1209600, // 14 days
    name: GET_AIRDROP_CLAIM,
    getKey: (airdropId: AirdropId) => airdropId,
  }
);
