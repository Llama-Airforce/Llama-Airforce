import { type useCurvePoolsStore } from "@CM/Pages/Platform/PoolsOld/Store";
import type { Pool } from "@CM/Pages/Platform/PoolsOld/Models";
import {
  type PoolService,
  type ReservesService,
  type CandleService,
  type VolumeService,
} from "@CM/Pages/Platform/PoolsOld/Services";

export async function getPools(
  store: ReturnType<typeof useCurvePoolsStore>,
  service: PoolService
) {
  // Don't request new pools if there's already cached or loading.
  if (store.pools.length > 0 || store.poolsLoading) {
    return;
  }

  store.poolsLoading = true;
  const { pools } = await service.get();
  store.pools = pools;

  store.poolsLoading = false;
}

export async function getReserves(
  store: ReturnType<typeof useCurvePoolsStore>,
  service: ReservesService,
  pool?: Pool
) {
  if (!pool) {
    return;
  }

  // Don't request new reserves if there's already cached.
  if (store.reserves[pool.name]) {
    return;
  }

  // Introduce delay so the animation doesn't lag immediately.
  store.poolsLoading = true;

  try {
    const { reserves } = await service.get(pool);
    store.setReserves(pool.address, reserves);
  } finally {
    store.poolsLoading = false;
  }
}

export async function getCandles(
  store: ReturnType<typeof useCurvePoolsStore>,
  service: CandleService,
  pool?: Pool
) {
  if (!pool) {
    return;
  }

  // Don't request new candles if there's already cached.
  if (store.candles[pool.name]) {
    return;
  }

  // Introduce delay so the animation doesn't lag immediately.
  store.poolsLoading = true;

  try {
    const candles = await service.get(pool);

    if (candles) {
      store.setCandles(pool.address, candles);
    }
  } finally {
    store.poolsLoading = false;
  }
}

export async function getVolumes(
  store: ReturnType<typeof useCurvePoolsStore>,
  service: VolumeService,
  pool?: Pool
) {
  if (!pool) {
    return;
  }

  // Don't request new volumes if there's already cached.
  if (store.volumes[pool.name]) {
    return;
  }

  // Introduce delay so the animation doesn't lag immediately.
  store.poolsLoading = true;

  try {
    const { volume } = await service.get(pool);
    store.setVolumes(pool.address, volume);
  } finally {
    store.poolsLoading = false;
  }
}
