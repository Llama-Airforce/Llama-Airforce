import { minDelay } from "@/Util";
import { useCurveStore } from "@/Pages/Curve/Store";
import Pool from "@/Pages/Curve/Models/Pool";
import ReservesService from "@/Pages/Curve/Pools/Services/ReservesService";
import CandleService from "@/Pages/Curve/Pools/Services/CandleService";
import VolumeService from "@/Pages/Curve/Pools/Services/VolumeService";
import PoolService from "@/Pages/Curve/Services/PoolService";

export async function getPools(
  store: ReturnType<typeof useCurveStore>,
  service: PoolService
) {
  // Don't request new pools if there's already cached or loading.
  if (store.pools.length > 0 || store.poolsLoading) {
    return;
  }

  store.poolsLoading = true;
  const resp = await minDelay(service.get());

  if (resp) {
    store.pools = resp;
  } else {
    store.poolsLoadingError = true;
  }

  store.poolsLoading = false;
}

export async function getReserves(
  store: ReturnType<typeof useCurveStore>,
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
    const reserves = await minDelay(service.get(pool), 500);

    if (reserves) {
      store.setReserves(pool.id, reserves);
    }
  } finally {
    store.poolsLoading = false;
  }
}

export async function getCandles(
  store: ReturnType<typeof useCurveStore>,
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
    const candles = await minDelay(service.get(pool), 500);

    if (candles) {
      store.setCandles(pool.id, candles);
    }
  } finally {
    store.poolsLoading = false;
  }
}

export async function getVolumes(
  store: ReturnType<typeof useCurveStore>,
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
    const volumes = await minDelay(service.get(pool), 500);

    if (volumes) {
      store.setVolumes(pool.id, volumes);
    }
  } finally {
    store.poolsLoading = false;
  }
}
