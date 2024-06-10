import { defineStore } from "pinia";
import { type Address } from "viem";
import type {
  PounderId,
  Pounder,
  PounderState,
  VaultViem,
  ZapDeposit,
  ZapsFactories,
} from "@Pounders/Models";
import type { Claim } from "@LAF/Services/UnionService";
import { getVirtualPriceViem } from "@Pounders/Util/UnionHelper";

type PounderStore = {
  pounder: Pounder<VaultViem>;
  state: PounderState;
  zapsFactories: ZapsFactories;
};

// eslint-disable-next-line max-lines-per-function
export const useUnionStore = defineStore("unionStore", () => {
  const pounders: Record<PounderId, PounderStore | null> = {
    ucrv: null,
    ucrv2: null,
    ufxs: null,
    uprisma: null,
    ucvx: null,
    ubal: null,
    ufxslp: null,
  };

  const claims: Record<PounderId, Claim | undefined> = {
    ucrv: undefined,
    ucrv2: undefined,
    ufxs: undefined,
    uprisma: undefined,
    ucvx: undefined,
    ubal: undefined,
    ufxslp: undefined,
  };

  function getPounder(pounderId: PounderId) {
    const pounder = pounders[pounderId];

    return {
      pounder: pounder?.pounder,
      state: pounder?.state,
      zapsFactories: pounder?.zapsFactories,
    };
  }

  async function updatePounder(pounderId: PounderId) {
    const { pounder, state } = getPounder(pounderId);
    if (!pounder || !state) {
      return;
    }

    const [
      priceUnderlying,
      apy,
      decimalsWithdraw,
      symbolWithdraw,
      tvl,
      priceShare,
      oraclePrice,
    ] = await Promise.all([
      pounder.getPriceUnderlying(),
      pounder.getApy(),
      pounder.contract.read.decimals(),
      pounder.contract.read.symbol(),
      pounder.contract.read.totalSupply(),
      getVirtualPriceViem(pounder.contract),
      pounder.lp?.getOraclePrice() ?? 1,
    ]);

    state.priceUnderlying = priceUnderlying;
    state.apy = apy;
    state.symbolLpPrimary = pounder.lp?.symbolPrimary ?? "";
    state.decimalsWithdraw = BigInt(decimalsWithdraw);
    state.symbolWithdraw = symbolWithdraw;
    state.tvl = tvl;
    state.priceShare = priceShare;
    state.oraclePrice = oraclePrice;
  }

  async function updateBalances(pounderId: PounderId, wallet?: Address) {
    const { pounder, state } = getPounder(pounderId);

    if (state) {
      if (wallet && pounder) {
        state.balanceWithdraw = await pounder.contract.read.balanceOf([wallet]);
      } else {
        state.balanceWithdraw = undefined;
      }
    }
  }

  async function updateZapDeposit(
    pounderId: PounderId,
    zapDeposit: ZapDeposit | undefined
  ) {
    const { state } = getPounder(pounderId);

    if (state && zapDeposit) {
      state.symbolDeposit = zapDeposit.depositSymbol;
      state.balanceDeposit = await zapDeposit.depositBalance();
      state.decimalsDeposit = (await zapDeposit.depositDecimals()) ?? 18n;
    }
  }

  function updateClaim(pounderId: PounderId, claim?: Claim) {
    const { state } = getPounder(pounderId);
    if (!state) {
      return;
    }

    state.balanceUnclaimed = BigInt(claim ? claim.amount : 0);
  }

  return {
    pounders,
    claims,
    getPounder,
    updatePounder,
    updateBalances,
    updateZapDeposit,
    updateClaim,
  };
});
