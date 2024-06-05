import { reactive } from "vue";
import { bigNumToNumber } from "@/Util";
import { type PounderState } from "@Pounders/Models";

export function create(): PounderState {
  return reactive({
    priceUnderlying: null,
    priceShare: null,

    balanceDeposit: null,
    balanceWithdraw: null,
    balanceUnclaimed: null,

    decimalsDeposit: 18n,
    decimalsWithdraw: 18n,

    symbolDeposit: "???",
    symbolWithdraw: "???",
    symbolLpPrimary: "???",

    oraclePrice: 1,
    tvl: null,
    apy: null,
    fees: null,
  });
}

export function getTvl(state: PounderState): number | null {
  if (
    state.tvl === null ||
    state.priceUnderlying === null ||
    state.priceShare === null
  ) {
    return null;
  }

  return (
    bigNumToNumber(state.tvl, state.decimalsWithdraw) *
    state.priceUnderlying *
    state.priceShare
  );
}

/** The total withdrawable balance, including unclaimed amount. */
export function getBalance(state: PounderState): bigint | null {
  if (state.balanceWithdraw === null || state.balanceUnclaimed === null) {
    return null;
  }

  return state.balanceWithdraw + state.balanceUnclaimed;
}

/** The total withdrawable balance in dollars, including unclaimed amount. */
export function getBalanceDollars(state: PounderState): number | null {
  if (
    state.balanceWithdraw === null ||
    state.balanceUnclaimed === null ||
    state.priceUnderlying === null ||
    state.priceShare === null
  ) {
    return null;
  }

  const balance = state.balanceWithdraw + state.balanceUnclaimed;

  return (
    bigNumToNumber(balance, state.decimalsDeposit) *
    state.priceUnderlying *
    state.priceShare
  );
}

/** The underlying aTkn value of the balance. */
export function getBalanceUnderlying(state: PounderState): number | null {
  if (state.balanceWithdraw === null || state.priceShare === null) {
    return null;
  }

  return (
    bigNumToNumber(state.balanceWithdraw, state.decimalsDeposit) *
    state.priceShare
  );
}

/** The underlying aTkn value of unclaimed value. */
export function getBalanceUnclaimed(state: PounderState): number | null {
  if (state.balanceUnclaimed === null || state.priceShare === null) {
    return null;
  }

  return (
    bigNumToNumber(state.balanceUnclaimed, state.decimalsDeposit) *
    state.priceShare
  );
}
