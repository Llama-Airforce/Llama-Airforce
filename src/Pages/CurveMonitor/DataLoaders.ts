import { Subscription } from "rxjs";
import { useCurveMonitorStore } from "@/Pages/CurveMonitor/Store";
import type { Pool } from "@/Pages/CurveMonitor/Models";
import {
  PoolService,
  ReservesService,
  CandleService,
  VolumeService,
  TransactionService,
} from "@/Pages/CurveMonitor/Services";

export async function getPools(
  store: ReturnType<typeof useCurveMonitorStore>,
  service: PoolService,
  input: string
) {
  const resp = await service.get(input);

  if (resp) {
    store.pools = resp;
  } else {
    store.poolsLoadingError = true;
  }
}

export async function getReserves(
  store: ReturnType<typeof useCurveMonitorStore>,
  service: ReservesService,
  pool: Pool
) {
  try {
    const reserves = await service.get(pool);

    if (reserves) {
      store.reserves = reserves;
    }
  } catch {
    store.poolsLoadingError = true;
  }
}

export async function getCandles(
  store: ReturnType<typeof useCurveMonitorStore>,
  service: CandleService,
  pool: Pool
) {
  try {
    const candles = await service.get(pool);

    if (candles) {
      store.candles = candles;
    }
  } catch {
    store.poolsLoadingError = true;
  }
}

export async function getVolumes(
  store: ReturnType<typeof useCurveMonitorStore>,
  service: VolumeService,
  pool: Pool
) {
  try {
    const volumes = await service.get(pool);

    if (volumes) {
      store.volumes = volumes;
    }
  } catch {
    store.poolsLoadingError = true;
  }
}

let subscriptionTx: Subscription | null = null;
export function getTransactions(
  store: ReturnType<typeof useCurveMonitorStore>,
  service: TransactionService
) {
  // Unsubscribe from from existing subscriptions.
  if (subscriptionTx) {
    subscriptionTx.unsubscribe();
  }

  try {
    subscriptionTx = service.get$.subscribe({
      next: (tx) => {
        store.addTransaction(tx);
      },
      error: (err) => console.error(err),
    });
    service.connect();
  } catch (err) {
    console.error(err);
    store.poolsLoadingError = true;
  }
}
