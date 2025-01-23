import { fetchType as fetch } from "@/Services";
import type { Chain } from "@/Types/Chain";
import { getHost, type Options } from "..";
import type * as ApiTypes from "./apiTypes";
import * as Parsers from "./parsers";

export async function getSupportedChains(options: Options = {}) {
  const host = await getHost(options);
  const resp = await fetch<ApiTypes.GetSupportedChainsResponse>(
    `${host}/v1/chains/`
  );

  return Parsers.parseSupportedChains(resp);
}

export async function getChainInfo(chain: Chain, options: Options = {}) {
  const host = await getHost(options);
  const resp = await fetch<ApiTypes.GetChainInfoResponse>(
    `${host}/v1/chains/${chain}?page=1&per_page=1`
  );

  return Parsers.parseChainInfo(resp);
}

export async function getTxs(options: Options = {}) {
  const host = await getHost(options);
  const resp = await fetch<ApiTypes.GetTransactionsResponse>(
    `${host}/v1/chains/activity/transactions`
  );

  return Parsers.parseTxs(resp);
}

export async function getUsers(options: Options = {}) {
  const host = await getHost(options);
  const resp = await fetch<ApiTypes.GetUsersResponse>(
    `${host}/v1/chains/activity/users`
  );

  return Parsers.parseUsers(resp);
}
