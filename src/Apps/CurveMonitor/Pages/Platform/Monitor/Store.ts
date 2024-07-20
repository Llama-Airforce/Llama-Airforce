import { ref } from "vue";
import { defineStore } from "pinia";
import type { Pool, Coin, Pair, TimeRange } from "@CM/Models";
import type {
  Balances,
  Volume,
  Price,
  Transaction,
  Tvl,
  Bonding,
} from "@CM/Pages/Platform/Monitor/Models";
import type { SocketPool, SocketRoot } from "@CM/Services/Sockets";

export const useMonitorStore = defineStore("monitorStore", () => {
  const socket = ref<SocketRoot | null>(null);
  const socketPool = ref<SocketPool | null>(null);

  const pool = ref<Pool | null>(null);
  const pools = ref<Pool[]>([]);
  const poolsLoadingError = ref<boolean>(false);
  const prices = ref<Price[]>([]);
  const balances = ref<Balances[]>([]);
  const volumes = ref<Volume[]>([]);
  const transactions = ref<Transaction[]>([]);
  const tvl = ref<Tvl[]>([]);
  const bonding = ref<Bonding>({
    curve: [],
    balanceCoin0: 0,
    balanceCoin1: 0,
  });
  const coins = ref<Coin[]>([]);
  const pair = ref<Pair | null>(null);
  const timeRange = ref<TimeRange>("month");

  return {
    socket,
    socketPool,
    pool,
    pools,
    poolsLoadingError,
    prices,
    balances,
    volumes,
    transactions,
    tvl,
    bonding,
    coins,
    pair,
    timeRange,
  };
});
