import { Fee } from "@CM/Pages/Platform/Gauges/Models/Fee";
import { Emission } from "@CM/Pages/Platform/Gauges/Models/Emission";

export type GaugeSnapshots = {
  name: string;
  feeSnapshots: Fee[];
  emissionSnapshots: Emission[];
};
