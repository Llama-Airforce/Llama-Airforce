import { getHost, type Options, type Chain } from "..";
import { fetchJson as fetch } from "../fetch";
import type * as Responses from "./responses";
import * as Parsers from "./parsers";

export async function getSupportedChains(options?: Options) {
  const host = await getHost(options);
  const resp = await fetch<Responses.GetSupportedChainsResponse>(
    `${host}/v1/chains/`
  );

  return Parsers.parseSupportedChains(resp);
}

export async function getChainInfo(chain: Chain, options?: Options) {
  const host = await getHost(options);
  const resp = await fetch<Responses.GetChainInfoResponse>(
    `${host}/v1/chains/${chain}?page=1&per_page=1`
  );

  return Parsers.parseChainInfo(resp);
}

export async function getTxs(options?: Options) {
  const host = await getHost(options);
  const resp = await fetch<Responses.GetTransactionsResponse>(
    `${host}/v1/chains/activity/transactions`
  );

  return Parsers.parseTxs(resp);
}

export async function getUsers(options?: Options) {
  const host = await getHost(options);
  const resp = await fetch<Responses.GetUsersResponse>(
    `${host}/v1/chains/activity/users`
  );

  return Parsers.parseUsers(resp);
}
