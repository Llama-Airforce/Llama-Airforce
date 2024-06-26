import { ServiceBaseHost } from "@/Services";
import type { EpochFrax } from "@LAF/Pages/Bribes/FraxMatch/Models/EpochFrax";
import type { PoolId, Pool } from "@LAF/Pages/Bribes/FraxMatch/Models/Pool";

export default class FraxMatchService extends ServiceBaseHost {
  public async getPools(): Promise<{ pools: Pool[] }> {
    const host = await this.getHost();
    return this.fetch(`${host}/fraxmatch/pools`);
  }

  public async getEpochs(poolId: PoolId): Promise<{ epochs: EpochFrax[] }> {
    const poolIds = expandPoolIds(poolId);
    const host = await this.getHost();

    return this.fetch(`${host}/fraxmatch/epochs`, {
      poolIds,
    });
  }
}

/** Some pool names have changed over time, we'd like to bundle them together. */
function expandPoolIds(poolId: string): string[] {
  // Alchemix.
  const alchemix = [
    "f-fraxbpalusd",
    "alUSD+crvFRAX (0xB30d…)",
    "alUSD+crvFRAX (0xB30d…30A5)",
  ];

  if (alchemix.includes(poolId)) {
    return alchemix;
  }

  // USDD
  const usdd = [
    "f-fraxbpusdd",
    "USDD+crvFRAX (0x4606…)",
    "USDD+crvFRAX (0x4606…6A20)",
  ];

  if (usdd.includes(poolId)) {
    return usdd;
  }

  // TUSD
  const tusd = [
    "f-fraxbptusd",
    "TUSD+crvFRAX (0x33ba…)",
    "TUSD+crvFRAX (0x33ba…E893)",
  ];

  if (tusd.includes(poolId)) {
    return tusd;
  }

  // APE
  const ape = [
    "f-fraxbpape",
    "ApeUSD+crvFRAX (0x04b7)",
    "ApeUSD+crvFRAX (0x04b7…077D)",
  ];

  if (ape.includes(poolId)) {
    return ape;
  }

  return [poolId];
}
