import { ServiceBase } from "@/Services";
import {
  type DecimalLabelledSeries,
  type DecimalTimeSeries,
} from "@PM/Services/Series";

const API_URL = "https://api.prismamonitor.com/v1";

export type HistoricalTroveManagerData = {
  manager: string;
  data: DecimalTimeSeries[];
};

export type CollateralRatioDecilesData = {
  label: string;
  data: number;
};

export default class ManagerService extends ServiceBase {
  public async getHistoricalOpenTrovesOverview(
    chain: string,
    period: string
  ): Promise<{ managers: HistoricalTroveManagerData[] }> {
    return this.fetch(
      `${API_URL}/managers/${chain}/open_troves?period=${period}`
    );
  }

  public async getHistoricalCollateralRatiosOverview(
    chain: string,
    period: string
  ): Promise<{ managers: HistoricalTroveManagerData[] }> {
    return this.fetch(
      `${API_URL}/managers/${chain}/collateral_ratios?period=${period}`
    );
  }

  public async getCollateralRatioGrouped(
    chain: string,
    period: string
  ): Promise<HistoricalTroveManagerData> {
    return this.fetch(
      `${API_URL}/managers/${chain}/global_collateral_ratio?period=${period}`
    );
  }

  public async getHistoricalCollateralOverview(
    chain: string,
    period: string
  ): Promise<{ managers: HistoricalTroveManagerData[] }> {
    return this.fetch(
      `${API_URL}/managers/${chain}/collateral?period=${period}`
    );
  }

  public async getRatioDistributionGrouped(
    chain: string
  ): Promise<{ deciles: CollateralRatioDecilesData[] }> {
    return this.fetch(`${API_URL}/managers/${chain}/ratio_distribution`);
  }

  public async getLargeTrovePositions(
    chain: string,
    manager: string,
    unit: string
  ): Promise<{ positions: DecimalLabelledSeries[] }> {
    return this.fetch(
      `${API_URL}/managers/${chain}/${manager}/large_positions?unit=${unit}`
    );
  }

  public async getVaultCollateralRatio(
    chain: string,
    manager: string,
    period: string
  ): Promise<{ ratio: DecimalTimeSeries[] }> {
    return this.fetch(
      `${API_URL}/managers/${chain}/${manager}/collateral_ratio?period=${period}`
    );
  }

  public async getVaultTroveCount(
    chain: string,
    manager: string,
    period: string
  ): Promise<{ count: DecimalTimeSeries[] }> {
    return this.fetch(
      `${API_URL}/managers/${chain}/${manager}/open_trove_count?period=${period}`
    );
  }

  public async getTroveDistribution(
    chain: string,
    manager: string,
    unit: string
  ): Promise<{ distribution: DecimalLabelledSeries[] }> {
    return this.fetch(
      `${API_URL}/managers/${chain}/${manager}/histograms?unit=${unit}`
    );
  }
}
