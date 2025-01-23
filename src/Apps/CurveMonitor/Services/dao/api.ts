import { fetchType as fetch } from "@/Services";
import { getHost, type Options } from "..";
import type * as ApiTypes from "./apiTypes";
import * as Parsers from "./parsers";

export async function getVotesOverview(options: Options = {}) {
  const host = await getHost(options);
  const resp = await fetch<ApiTypes.GetVotesOverviewResponse>(
    `${host}/v1/dao/votes/overview`
  );

  return resp.data.map(Parsers.parseVotesOverview);
}

export async function getLocksDaily(days: number, options: Options = {}) {
  const host = await getHost(options);
  const resp = await fetch<ApiTypes.GetLocksDailyResponse>(
    `${host}/v1/dao/locks/daily/${days}`
  );

  return resp.locks.map(Parsers.parseLocksDaily);
}

export async function getUserLocks(user: string, options: Options = {}) {
  const host = await getHost(options);
  const resp = await fetch<ApiTypes.GetUserLocksResponse>(
    `${host}/v1/dao/locks/${user}`
  );

  return resp.locks.map(Parsers.parseUserLock);
}

export async function getLockers(top: number, options: Options = {}) {
  const host = await getHost(options);
  const resp = await fetch<ApiTypes.GetLockersResponse>(
    `${host}/v1/dao/lockers/${top}`
  );

  return resp.users.map(Parsers.parseLockers);
}

export async function getSupply(days: number, options: Options = {}) {
  const host = await getHost(options);
  const resp = await fetch<ApiTypes.GetSupplyResponse>(
    `${host}/v1/dao/supply/${days}`
  );

  return resp.supply.map(Parsers.parseSupply);
}
