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

type State = {
  pounders: Record<PounderId, PounderStore | null>;
  claims: Record<PounderId, Claim | undefined>;
};

export const useUnionStore = defineStore({
  id: "unionStore",
  state: (): State => ({
    pounders: {
      ucrv: null,
      ucrv2: null,
      ufxs: null,
      uprisma: null,
      ucvx: null,
      ubal: null,
      ufxslp: null,
    },
    claims: {
      ucrv: undefined,
      ucrv2: undefined,
      ufxs: undefined,
      uprisma: undefined,
      ucvx: undefined,
      ubal: undefined,
      ufxslp: undefined,
    },
  }),
  actions: {
    getPounder(pounderId: PounderId) {
      const pounder = this.pounders[pounderId];

      return {
        pounder: pounder?.pounder,
        state: pounder?.state,
        zapsFactories: pounder?.zapsFactories,
      };
    },

    async updatePounder(pounderId: PounderId) {
      const { pounder, state } = this.getPounder(pounderId);
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
    },

    async updateBalances(pounderId: PounderId, wallet?: Address) {
      const { pounder, state } = this.getPounder(pounderId);

      if (state) {
        if (wallet && pounder) {
          state.balanceWithdraw = await pounder.contract.read.balanceOf([
            wallet,
          ]);
        } else {
          state.balanceWithdraw = undefined;
        }
      }
    },

    async updateZapDeposit(
      pounderId: PounderId,
      zapDeposit: ZapDeposit | undefined
    ) {
      const { state } = this.getPounder(pounderId);

      if (state && zapDeposit) {
        state.symbolDeposit = zapDeposit.depositSymbol;
        state.balanceDeposit = await zapDeposit.depositBalance();
        state.decimalsDeposit = (await zapDeposit.depositDecimals()) ?? 18n;
      }
    },

    updateClaim(pounderId: PounderId, claim?: Claim) {
      const { state } = this.getPounder(pounderId);
      if (!state) {
        return;
      }

      state.balanceUnclaimed = BigInt(claim ? claim.amount : 0);
    },
  },
});
