import { keepPreviousData } from "@tanstack/vue-query";
import type * as Models from "./models";
import ProposalService from "./service";

const service = new ProposalService();

function initEmptyArray() {
  return {
    initialData: [],
    initialDataUpdatedAt: 0,
  };
}

export function useQueryProposal(
  id: Ref<number>,
  type: Ref<Models.ProposalType>,
  enabled?: Ref<boolean>
) {
  return useQuery({
    queryKey: ["proposal", id, type] as const,
    queryFn: ({ queryKey: [, id, type] }) => service.getProposal(id, type),
    ...(enabled && { enabled }),
  });
}

export function useQueryProposals(
  page: Ref<number>,
  type: Ref<Models.ProposalType>,
  status: Ref<Models.ProposalStatus>,
  search: Ref<string>
) {
  return useQuery({
    queryKey: ["proposals", page, search, type, status] as const,
    queryFn: ({ queryKey: [, page, search, type, status] }) =>
      service.getProposals(page, search, type, status),
    placeholderData: keepPreviousData,
  });
}

export function useQueryUserProposalVotes(user: Ref<string | undefined>) {
  return useQuery({
    queryKey: ["proposal-user-votes", computed(() => user.value)] as const,
    queryFn: ({ queryKey: [, user] }) => service.getUserProposalVotes(user!),
    enabled: computed(() => !!user.value),
    ...initEmptyArray(),
  });
}
