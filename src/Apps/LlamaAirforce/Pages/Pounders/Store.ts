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

      state.priceUnderlying = await pounder.getPriceUnderlying();
      state.apy = await pounder.getApy();
      state.symbolLpPrimary = pounder.lp?.symbolPrimary ?? "";

      state.decimalsWithdraw = BigInt(await pounder.contract.read.decimals());
      state.symbolWithdraw = await pounder.contract.read.symbol();

      state.tvl = await pounder.contract.read.totalSupply();
      state.priceShare = await getVirtualPriceViem(pounder.contract);
      state.oraclePrice = (await pounder.lp?.getOraclePrice()) ?? 1;
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
