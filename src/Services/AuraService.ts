import {
  EpochOverview,
  OverviewResponse,
} from "@/Apps/LlamaAirforce/Pages/Bribes/Models";
import {
  AuraConstants,
  getLatestAuraRound,
} from "@/Apps/LlamaAirforce/Pages/Bribes/Util/AuraHelper";
import ServiceBase from "@/Services/ServiceBase";
import { flattenDeep } from "lodash";

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
  bribes: any[];
  index: number;
};

type GaugeResponse = {
  data: GaugeVote[];
};

const { API_URL, START_ROUND, START_DATE, BIWEEKLY } = AuraConstants;

export default class AuraService extends ServiceBase {
  public readonly latestRound: number;

  constructor(host: string) {
    super(host);
    this.latestRound = getLatestAuraRound();
  }

  private async fetchRound(timestamp: number): Promise<GaugeVote[]> {
    return this.fetch<GaugeResponse>(`${API_URL}/${timestamp}`).then(
      (resp) => resp.data
    );
  }

  private async fetchRounds(): Promise<GaugeVote[][]> {
    const today = Math.floor(Date.now() / 1000);
    const len = Math.ceil((today - START_DATE) / BIWEEKLY);

    return Promise.all(
      [...new Array(len)].map((_, i) =>
        this.fetchRound(START_DATE + i * BIWEEKLY)
      )
    );
  }

  public async getRound(_epochId?: number): Promise<any> {
    if ((_epochId ?? Number.MAX_VALUE) < START_ROUND - 1) {
      return Promise.resolve(null);
    }

    const epochId = _epochId || this.latestRound;

    const round = await this.fetchRound(
      START_DATE + (START_ROUND - epochId) * BIWEEKLY
    );

    const bribed = Object.fromEntries(
      round
        .map((vote) => [vote.title, vote.totalValue])
        .filter(([_, value]) => !!value)
    );

    const bribes = flattenDeep(
      round.map((vote) =>
        vote.bribes.map((bribe) => ({
          pool: vote.title,
          token: bribe.symbol,
          amount: bribe.amount,
          amountDollars: bribe.value,
        }))
      )
    );

    return Promise.resolve({
      success: true,
      epoch: {
        round: 27,
        platform: "hh",
        protocol: "aura-bal",
        proposal:
          "0x8329fa2ddeaca8cfd6652adbb855bce8424730bcc7407950408893e1a0eaf1e6",
        end: 1687831200,
        bribed,
        bribes,
      },
    });
  }

  public async getOverview(): Promise<OverviewResponse> {
    const roundOverviewPromise = this.fetchRounds().then((data) =>
      data.map((votes, index) => {
        const totalAmountDollars = votes.reduce(
          (acc, { totalValue }) => acc + totalValue,
          0
        );
        const totalVotes = votes.reduce(
          (acc, { voteCount }) => acc + voteCount,
          0
        );
        const dollarPerVlAsset =
          totalVotes > 0 ? totalAmountDollars / totalVotes : 0;
        const round = START_ROUND + index;
        const end = votes[votes.length - 1].proposalDeadline;

        return {
          proposal: "", // TODO: - fix
          totalAmountDollars,
          end,
          dollarPerVlAsset,
          round,
        } as EpochOverview;
      })
    );

    return roundOverviewPromise.then((epochs) => ({
      success: !!epochs.length,
      dashboard: {
        id: "bribes-overview-aura",
        rewardPerDollarBribe: 122, // TODO: - fix
        epochs,
      },
    }));
  }
}
