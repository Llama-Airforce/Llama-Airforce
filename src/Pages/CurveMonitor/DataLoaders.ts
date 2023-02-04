import { Subscription } from "rxjs";
import { useCurveMonitorStore } from "@/Pages/CurveMonitor/Store";
import type { Pool } from "@/Pages/CurveMonitor/Models";
import {
  PoolService,
  ReservesService,
  PriceService,
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

let subPrices: Subscription | null = null;
export function getPrices(
  store: ReturnType<typeof useCurveMonitorStore>,
  service: PriceService
) {
  // Unsubscribe from from existing subscriptions.
  if (subPrices) {
    subPrices.unsubscribe();
  }

  try {
    subPrices = service.get$.subscribe({
      next: (tx) => {
        store.addPrice(tx);
      },
      error: (err) => console.error(err),
    });
  } catch (err) {
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

let subTxs: Subscription | null = null;
export function getTransactions(
  store: ReturnType<typeof useCurveMonitorStore>,
  service: TransactionService
) {
  // Unsubscribe from from existing subscriptions.
  if (subTxs) {
    subTxs.unsubscribe();
  }

  try {
    subTxs = service.get$.subscribe({
      next: (tx) => {
        store.addTransaction(tx);
      },
      error: (err) => console.error(err),
    });
  } catch (err) {
    store.poolsLoadingError = true;
  }
}
