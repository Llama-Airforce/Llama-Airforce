import type { Address } from "..";
import * as Api from "./api";

export function useQuerySolverCompetition(tx: Ref<Address>) {
  return useQuery({
    queryKey: ["solver-competition", tx] as const,
    queryFn: ({ queryKey: [, tx] }) => Api.getCompetition(tx),
  });
}
