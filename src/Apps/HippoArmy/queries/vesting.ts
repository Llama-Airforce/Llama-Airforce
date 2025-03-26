import * as Api from "../services/vesting";

export function useRedemptions(
  params: MaybeRefOrGetter<Parameters<typeof Api.getRedemptions>[0]>
) {
  return useQuery({
    queryKey: ["vesting-redemptions", params] as const,
    queryFn: () => Api.getRedemptions(toValue(params)),
  });
}

export function useRedemptionsProjection(
  params: MaybeRefOrGetter<Parameters<typeof Api.getRedemptionsProjection>[0]>
) {
  return useQuery({
    queryKey: ["vesting-redemptions-projection", params] as const,
    queryFn: () => Api.getRedemptionsProjection(toValue(params)),
  });
}

export function useAirdropsTeam(
  params: MaybeRefOrGetter<Parameters<typeof Api.getAirdropsTeam>[0]>
) {
  return useQuery({
    queryKey: ["vesting-airdrops-team", params] as const,
    queryFn: () => Api.getAirdropsTeam(toValue(params)),
  });
}

export function useAirdropsTeamProjection(
  params: MaybeRefOrGetter<Parameters<typeof Api.getAirdropsTeamProjection>[0]>
) {
  return useQuery({
    queryKey: ["vesting-airdrops-team-projection", params] as const,
    queryFn: () => Api.getAirdropsTeamProjection(toValue(params)),
  });
}

export function useAirdropsVictims(
  params: MaybeRefOrGetter<Parameters<typeof Api.getAirdropsVictims>[0]>
) {
  return useQuery({
    queryKey: ["vesting-airdrops-victims", params] as const,
    queryFn: () => Api.getAirdropsVictims(toValue(params)),
  });
}

export function useAirdropsVictimsProjection(
  params: MaybeRefOrGetter<
    Parameters<typeof Api.getAirdropsVictimsProjection>[0]
  >
) {
  return useQuery({
    queryKey: ["vesting-airdrops-victims-projection", params] as const,
    queryFn: () => Api.getAirdropsVictimsProjection(toValue(params)),
  });
}

export function useCirculatingSupply() {
  return useQuery({
    queryKey: ["vesting-circulating-supply"] as const,
    queryFn: () => Api.getCirculatingSupply(),
  });
}
