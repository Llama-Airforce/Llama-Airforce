import * as Api from "../services/dao";
import type { pagination } from "../services/schema";

export function useProposals(
  params: MaybeRefOrGetter<
    Omit<Parameters<typeof Api.getProposals>[0], keyof typeof pagination>
  >
) {
  return useQuery({
    queryKey: ["dao-proposals", params] as const,
    queryFn: () => {
      const fs = (page: number, per_page: number) =>
        Api.getProposals({ ...toValue(params), page, per_page }).then(
          (x) => x.proposals
        );

      return paginate(fs, 1, 100);
    },
  });
}

export function useProposal(
  params: MaybeRefOrGetter<Parameters<typeof Api.getProposal>[0]>
) {
  return useQuery({
    queryKey: ["dao-proposal", params] as const,
    queryFn: () => Api.getProposal(toValue(params)),
  });
}

export function useProposalVotes(
  params: MaybeRefOrGetter<
    Omit<Parameters<typeof Api.getProposalVotes>[0], keyof typeof pagination>
  >
) {
  return useQuery({
    queryKey: ["dao-proposal-votes", params] as const,
    queryFn: () => {
      const fs = (page: number, per_page: number) =>
        Api.getProposalVotes({ ...toValue(params), page, per_page }).then(
          (x) => x.votes
        );

      return paginate(fs, 1, 100);
    },
  });
}
