import type { Address } from "@/Framework/Address";
import { ServiceBase } from "@/Services";

const THEGRAPH_URL = "https://api.thegraph.com/subgraphs/name/aurafinance/aura";

export type Delegation = {
  id: string;

  /** The one who votes on behalf of someone. */
  delegate: Address;

  /** The one who let somebody else use their voting power. */
  delegator: Address;

  timestamp: number;
  space: string;
};

type GetDelegatorResponse = {
  data: {
    auraLockerAccounts: {
      id: string;
      balanceLocked: string;
      delegate: {
        id: string;
      };
    }[];
  };
};

export default class AuraService extends ServiceBase {
  public async getDelegation(
    voter: Address,
    block: number
  ): Promise<Delegation> {
    const query = `{
      auraLockerAccounts(
        where: {
          id: "${voter}"
        },
        first: 100,
        block: {
          number: ${block}
        }
      ) {
        id,
        balanceLocked,
        delegate {
          id
        }
      }
    }`;

    const resp = await this.fetch<GetDelegatorResponse>(THEGRAPH_URL, {
      query,
    });

    const delegate = resp.data.auraLockerAccounts[0]?.delegate?.id as
      | Address
      | undefined;

    return {
      id: "",
      delegate: delegate ?? voter,
      delegator: voter,
      timestamp: 0,
      space: "",
    };
  }
}
