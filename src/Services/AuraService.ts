import {
  Epoch,
  EpochOverview,
  OverviewResponse,
} from "@/Apps/LlamaAirforce/Pages/Bribes/Models";
import {
  AuraConstants,
  getLatestAuraRound,
} from "@/Apps/LlamaAirforce/Pages/Bribes/Util/AuraHelper";
import ServiceBase from "@/Services/ServiceBase";
import { flattenDeep } from "lodash";

type GaugeResponse = {
  data: GaugeVote[];
};

type GaugeVote = {
  proposal: string;
  proposalHash: string;
  title: string;
  proposalDeadline: number;
  totalValue: number;
  maxTotalValue: number;
  voteCount: number;
  valuePerVote: number;
  maxValuePerVote: number;
  bribes: Bribe[];
  index: number;
};

type Bribe = {
  token: string;
  symbol: string;
  decimals: number;
  value: number;
  maxValue: number;
  amount: number;
  maxTokensPerVote: number;
  briber: string;
  periodIndex: number;
  chainId: number;
};

const { HH_API_URL, LA_API_URL, START_ROUND, START_DATE, BIWEEKLY } =
  AuraConstants;

export default class AuraService extends ServiceBase {
  public readonly latestRound: number;
  public readonly today: number;

  constructor(host: string) {
    super(host);
    this.latestRound = getLatestAuraRound();
    this.today = Math.floor(Date.now() / 1000);
  }

  private async fetchIncentivePerVote(): Promise<number> {
    return this.fetch<{ result: number }>(`${LA_API_URL}/${this.today}`)
      ?.then(({ result }) => result)
      .catch(() => Promise.resolve(0));
  }

  private async fetchRound(timestamp: number): Promise<GaugeVote[]> {
    return this.fetch<GaugeResponse>(`${HH_API_URL}/${timestamp}`).then(
      (resp) => resp.data
    );
  }

  private async fetchRounds(): Promise<GaugeVote[][]> {
    const len = Math.ceil((this.today - START_DATE) / BIWEEKLY);
    return Promise.all(
      [...new Array(len)].map((_, i) =>
        this.fetchRound(START_DATE + i * BIWEEKLY)
      )
    );
  }

  public async getRound(_epochId?: number): Promise<{
    success: boolean;
    epoch?: Epoch;
  }> {
    if ((_epochId ?? Number.MAX_VALUE) < START_ROUND - 1) {
      return Promise.resolve({ success: false });
    }

    const epochId = _epochId || this.latestRound;

    const round = await this.fetchRound(
      START_DATE + (epochId - START_ROUND) * BIWEEKLY
    );

    const end = round[round.length - 1].proposalDeadline;

    const bribed = Object.fromEntries(
      round
        .map(({ title, voteCount, totalValue }) => [
          title,
          totalValue > 0 ? voteCount : 0,
        ])
        .filter(([_, value]) => !!value)
    );

    const bribes = flattenDeep(
      round.map((vote) =>
        vote.bribes.map((bribe) => ({
          pool: vote.title,
          token: bribe.symbol.toUpperCase(),
          amount: bribe.amount,
          amountDollars: bribe.value,
        }))
      )
    );

    return Promise.resolve({
      success: true,
      epoch: {
        round: epochId,
        platform: "hh",
        protocol: "aura-bal",
        proposal: "",
        end,
        bribed,
        bribes,
      },
    });
  }

  public async getOverview(): Promise<OverviewResponse> {
    const roundOverviewPromise = this.fetchRounds().then((incentives) => {
      return incentives.map((item, index) => {
        const mapped = item.map(({ totalValue, voteCount }) => [
          totalValue,
          totalValue > 0 ? voteCount : 0,
        ]);

        const totalAmountDollars = mapped.reduce(
          (acc, [totalValue]) => acc + totalValue,
          0
        );
        const totalVotes = mapped.reduce(
          (acc, [_, voteCount]) => acc + voteCount,
          0
        );

        const dollarPerVlAsset =
          totalVotes > 0 ? totalAmountDollars / totalVotes : 0;
        const round = START_ROUND + index;
        const end = item[item.length - 1].proposalDeadline;

        return {
          protocol: "aura-bal",
          totalAmountDollars,
          end,
          dollarPerVlAsset,
          round,
          proposal: "",
        } as EpochOverview;
      });
    });

    const rewardPerDollarBribe = await this.fetchIncentivePerVote();

    return roundOverviewPromise.then((epochs) => ({
      success: !!epochs.length,
      dashboard: {
        id: "bribes-overview-aura",
        rewardPerDollarBribe,
        epochs,
      },
    }));
  }
}
