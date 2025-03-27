import * as Api from "../services/dao";

export function useQueryProposals(
  params: MaybeRefOrGetter<Parameters<typeof Api.getProposals>[0]>
) {
  return useQuery({
    queryKey: ["dao-proposals", params] as const,
    queryFn: () => Api.getProposals(toValue(params)),
  });
}

export function useQueryProposalVotes(
  params: MaybeRefOrGetter<Parameters<typeof Api.getProposalVotes>[0]>
) {
  return useQuery({
    queryKey: ["dao-proposal-votes", params] as const,
    queryFn: () => Api.getProposalVotes(toValue(params)),
  });
}
