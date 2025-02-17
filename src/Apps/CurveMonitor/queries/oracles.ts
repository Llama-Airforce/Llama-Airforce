import * as Api from "@CM/Services/oracles";

export function useQueryOracles() {
  return useQuery({
    queryKey: ["oracles-all"] as const,
    queryFn: () => Api.getOracles(),
  });
}
