import {
  EpochOverview,
  OverviewResponse,
} from "@/Apps/LlamaAirforce/Pages/Bribes/Models";
import ServiceBase from "@/Services/ServiceBase";

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

const API_URL = "https://api.hiddenhand.finance/proposal/aura";
const START_ROUND = 28;
const START_DATE = 1689019200;
const DAY = 60 * 60 * 24;
const BIWEEKLY = DAY * 14;

export default class HiddenHandService extends ServiceBase {
  private async getRound(timestamp: number): Promise<GaugeVote[]> {
    return this.fetch<GaugeResponse>(`${API_URL}/${timestamp}`).then(
      (resp) => resp.data
    );
  }

  private async getRounds(): Promise<GaugeVote[][]> {
    const today = Math.floor(Date.now() / 1000);
    const len = Math.ceil((today - START_DATE) / BIWEEKLY);

    return Promise.all(
      [...new Array(len)].map((_, i) =>
        this.getRound(START_DATE + i * BIWEEKLY)
      )
    );
  }

  public async getOverview(): Promise<OverviewResponse> {
    const roundOverviewPromise = this.getRounds().then((data) =>
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
