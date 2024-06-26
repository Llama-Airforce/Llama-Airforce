import { keepPreviousData } from "@tanstack/vue-query";
import ProposalService from "@CM/Services/Proposal";
import type * as Models from "@CM/Services/Proposal/Models";

const service = new ProposalService(useHost());

export function useQueryProposal(
  id: Ref<number>,
  type: Ref<Models.ProposalType>,
  enabled?: Ref<boolean>
) {
  return useQuery({
    queryKey: ["curve-proposal", id, type] as const,
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
    queryKey: ["curve-proposals", page, search, type, status] as const,
    queryFn: ({ queryKey: [, page, search, type, status] }) =>
      service.getProposals(page, search, type, status),
    placeholderData: keepPreviousData,
  });
}
