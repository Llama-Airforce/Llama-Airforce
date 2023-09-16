import { type Delegation } from "@/Apps/LlamaAirforce/Pages/Bribes/Rounds/Services/AuraService";
import { notEmpty } from "@/Util";
import { chain } from "lodash";

/**
 * Of delegates and a list of voters, find the one which counts.
 * The non-global one will have priority over the global one.
 */
export function prioritizeDelegates(
  delegations: Delegation[], // Global and space specific.
  voters: string[]
): Delegation[] {
  return chain(delegations)
    .filter(notEmpty)
    .filter((delegation) => voters.includes(delegation.delegate))
    .orderBy((d) => d.space, "desc")
    .uniqWith((x, y) => x.delegator === y.delegator)
    .value();
}
