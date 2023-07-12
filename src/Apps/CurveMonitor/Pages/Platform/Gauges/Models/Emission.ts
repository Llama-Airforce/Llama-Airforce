import { DataPoint } from "@CM/Pages/Platform/Gauges/Util/SnapshotHelper";

export type Emission = DataPoint & {
  crvAmount: number;
};

export type AggregatedUsdEmission = DataPoint;
