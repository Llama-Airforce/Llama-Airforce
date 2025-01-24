import type { Address } from "@CM/Services";
import * as Api from "@CM/Services/solver";

export function useQuerySolverCompetition(tx: Ref<Address>) {
  return useQuery({
    queryKey: ["solver-competition", tx] as const,
    queryFn: ({ queryKey: [, tx] }) => Api.getCompetition(tx),
  });
}
