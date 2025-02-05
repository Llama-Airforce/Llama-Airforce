import type { Address } from "@CM/Services";
import * as Api from "@CM/Services/solver";

const API_URL = "https://api.cow.fi";

export function useQuerySolverCompetition(tx: Ref<Address>) {
  return useQuery({
    queryKey: ["solver-competition", tx] as const,
    queryFn: ({ queryKey: [, tx] }) =>
      Api.getCompetition(tx, { host: API_URL }),
  });
}
