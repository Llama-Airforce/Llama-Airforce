import * as Api from "../services/stats";

export function useStats() {
  return useQuery({
    queryKey: ["stats"] as const,
    queryFn: async () => {
      const host = await useHost();
      return Api.getStats({
        host,
      });
    },
  });
}
