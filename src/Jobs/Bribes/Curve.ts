import { fetchType as fetch } from "@/Services/ServiceBase";

export type Gauge = {
  gauge: string;
  shortName: string;
};

const API_URL = "https://api.curve.fi/api/getAllGauges";

export async function getGauges(): Promise<Record<string, Gauge>> {
  const resp = await fetch<{ data: Record<string, Gauge> }>(API_URL);

  const gauges: Record<string, Gauge> = {};

  for (const x of Object.values(resp.data)) {
    const gaugeAddr = x.gauge.toLocaleLowerCase();
    const gauge: Gauge = {
      gauge: gaugeAddr,
      shortName: x.shortName,
    };

    gauges[gaugeAddr] = gauge;
  }

  return gauges;
}
