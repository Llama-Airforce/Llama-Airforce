import { z } from "zod";
import { fetchJson as fetch, addQueryString } from "@/Utils/fetch";
import { getHost, type Options } from "..";
import { pagination, proposalId } from "../schema";
import * as Schema from "./schema";

const getProposalsParams = z.object({
  search_string: z.string().optional(),
  order_by: z.enum(["created_at", "creator", "voters_count"]).optional(),
  ...pagination,
});

export async function getProposals(
  params: z.infer<typeof getProposalsParams>,
  options?: Options
) {
  const host = getHost(options);
  const validParams = getProposalsParams.parse(params);
  const queryString = addQueryString(validParams);

  const data = await fetch(
    `${host}/v1/dao/proposals${queryString}`,
    undefined,
    options?.signal
  );

  return Schema.proposalsResponse.parse(data);
}

const getProposalVotesParams = z.object({
  ...proposalId,
  ...pagination,
});

export async function getProposalVotes(
  params: z.infer<typeof getProposalVotesParams>,
  options?: Options
) {
  const host = getHost(options);
  const { proposal_id, ...validParams } = getProposalVotesParams.parse(params);
  const queryString = addQueryString(validParams);

  const data = await fetch(
    `${host}/v1/dao/proposals/${proposal_id}/votes${queryString}`,
    undefined,
    options?.signal
  );

  return Schema.proposalVotesResponse.parse(data);
}
