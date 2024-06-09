import { reactive } from "vue";
import { bigNumToNumber } from "@/Util";
import { type PounderState } from "@Pounders/Models";

export function create(): PounderState {
  return reactive({
    priceUnderlying: undefined,
    priceShare: undefined,

    balanceDeposit: undefined,
    balanceWithdraw: undefined,
    balanceUnclaimed: undefined,

    decimalsDeposit: 18n,
    decimalsWithdraw: 18n,

    symbolDeposit: "???",
    symbolWithdraw: "???",
    symbolLpPrimary: "???",

    oraclePrice: 1,
    tvl: undefined,
    apy: undefined,
    fees: undefined,
  });
}

export function getTvl(state: PounderState): number | undefined {
  if (
    state.tvl === undefined ||
    state.priceUnderlying === undefined ||
    state.priceShare === undefined
  ) {
    return undefined;
  }

  return (
    bigNumToNumber(state.tvl, state.decimalsWithdraw) *
    state.priceUnderlying *
    state.priceShare
  );
}

/** The total withdrawable balance, including unclaimed amount. */
export function getBalance(state: PounderState): bigint | undefined {
  if (
    state.balanceWithdraw === undefined ||
    state.balanceUnclaimed === undefined
  ) {
    return undefined;
  }

  return state.balanceWithdraw + state.balanceUnclaimed;
}

/** The total withdrawable balance in dollars, including unclaimed amount. */
export function getBalanceDollars(state: PounderState): number | undefined {
  if (
    state.balanceWithdraw === undefined ||
    state.balanceUnclaimed === undefined ||
    state.priceUnderlying === undefined ||
    state.priceShare === undefined
  ) {
    return;
  }

  const balance = state.balanceWithdraw + state.balanceUnclaimed;

  return (
    bigNumToNumber(balance, state.decimalsDeposit) *
    state.priceUnderlying *
    state.priceShare
  );
}

/** The underlying aTkn value of the balance. */
export function getBalanceUnderlying(state: PounderState): number | undefined {
  if (state.balanceWithdraw === undefined || state.priceShare === undefined) {
    return;
  }

  return (
    bigNumToNumber(state.balanceWithdraw, state.decimalsDeposit) *
    state.priceShare
  );
}

/** The underlying aTkn value of unclaimed value. */
export function getBalanceUnclaimed(state: PounderState): number | undefined {
  if (state.balanceUnclaimed === undefined || state.priceShare === undefined) {
    return;
  }

  return (
    bigNumToNumber(state.balanceUnclaimed, state.decimalsDeposit) *
    state.priceShare
  );
}
