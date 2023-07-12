import { type Fee } from "@CM/Pages/Platform/Gauges/Models/Fee";
import { type Emission } from "@CM/Pages/Platform/Gauges/Models/Emission";

export type GaugeSnapshots = {
  name: string;
  feeSnapshots: Fee[];
  emissionSnapshots: Emission[];
};
