import * as Api from "@curvefi/prices-api/oracles";

export function useQueryOracles() {
  return useQuery({
    queryKey: ["oracles-all"] as const,
    queryFn: () => Api.getOracles(),
  });
}
