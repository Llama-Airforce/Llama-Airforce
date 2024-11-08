import type { Address } from "@/Types/Address";
import SolverService from "./SolverService";

const service = new SolverService();

export function useQuerySolverCompetition(tx: Ref<Address>) {
  return useQuery({
    queryKey: ["solver-competition", tx] as const,
    queryFn: ({ queryKey: [, tx] }) => service.getCompetition(tx),
  });
}
