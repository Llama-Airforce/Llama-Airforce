import type { EpochOverview } from "@LAF/Pages/Bribes/Models";
export type { Result as OverviewResponse } from "@LAF/Server/routes/dashboard/overview/[id]";

export type OverviewId =
  | "bribes-overview-votium"
  | "bribes-overview-prisma"
  | "bribes-overview-fxn"
  | "bribes-overview-aura";

export type Overview = {
  id: OverviewId;
  rewardPerDollarBribe: number;
  epochs: EpochOverview[];
};
