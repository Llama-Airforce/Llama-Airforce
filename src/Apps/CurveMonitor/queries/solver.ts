import type { Address } from "@curvefi/prices-api";
import * as Api from "@curvefi/prices-api/solver";

const API_URL = "https://api.cow.fi";

export function useQuerySolverCompetition(tx: Ref<Address>) {
  return useQuery({
    queryKey: ["solver-competition", tx] as const,
    queryFn: ({ queryKey: [, tx] }) =>
      Api.getCompetition(tx, { host: API_URL }),
  });
}
