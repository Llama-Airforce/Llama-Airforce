import ServiceBase from "@/Services/ServiceBase";

const API_URL = "https://api.prismamonitor.com/v1";


export type DecimalTimeSeries = {
  timestamp: number;
  value: number;
};

export type DecimalLabelledSeries = {
  label: string;
  value: number;
};

export type HistoricalTroveManagerData = {
  manager: string;
  data: DecimalTimeSeries[];
};


export type CollateralRatioDecilesData = {
  label: string;
  data: number;
};

export default class PrismaService extends ServiceBase {

  public async getHistoricalOpenTrovesOverview(
    chain: string,
    period: string
  ): Promise<{ managers: HistoricalTroveManagerData[] }> {
    return this.fetch(`${API_URL}/managers/${chain}/open_troves?period=${period}`);
  }

  public async getHistoricalCollateralRatiosOverview(
    chain: string,
    period: string
  ): Promise<{ managers: HistoricalTroveManagerData[] }> {
    return this.fetch(`${API_URL}/managers/${chain}/collateral_ratios?period=${period}`);
  }

  public async getCollateralRatioGrouped(
    chain: string,
    period: string
  ): Promise<HistoricalTroveManagerData> {
    return this.fetch(`${API_URL}/managers/${chain}/global_collateral_ratio?period=${period}`);
  }

  public async getHistoricalCollateralOverview(
    chain: string,
    period: string
  ): Promise<{ managers: HistoricalTroveManagerData[] }> {
    return this.fetch(`${API_URL}/managers/${chain}/collateral?period=${period}`);
  }

  public async getRatioDistributionGrouped(
    chain: string
  ): Promise<{ deciles: CollateralRatioDecilesData[] }> {
    return this.fetch(`${API_URL}/managers/${chain}/ratio_distribution`);
  }

  public async getLargeTrovePositions(
    chain: string,
    manager: string,
    unit: string,
  ): Promise<{ positions: DecimalLabelledSeries[] }> {
    return this.fetch(`${API_URL}/managers/${chain}/${manager}/large_positions?unit=${unit}`);
  }

  public async getTroveDistribution(
    chain: string,
    manager: string,
    unit: string,
  ): Promise<{ distribution: DecimalLabelledSeries[] }> {
    return this.fetch(`${API_URL}/managers/${chain}/${manager}/histograms?unit=${unit}`);
  }
}
