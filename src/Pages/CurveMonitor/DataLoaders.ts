import { Subscription } from "rxjs";
import { useCurveMonitorStore } from "@/Pages/CurveMonitor/Store";
import type { Pool } from "@/Pages/CurveMonitor/Models";
import {
  PoolService,
  BalanceService,
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

let balances$_: Subscription | null = null;
export function getBalances(
  store: ReturnType<typeof useCurveMonitorStore>,
  service: BalanceService
) {
  // Unsubscribe from from existing subscriptions.
  if (balances$_) {
    balances$_.unsubscribe();
  }

  try {
    balances$_ = service.get$.subscribe({
      next: (balances) => {
        store.addBalances(balances);
      },
      error: (err) => console.error(err),
    });
  } catch (err) {
    store.poolsLoadingError = true;
  }
}

let prices$_: Subscription | null = null;
export function getPrices(
  store: ReturnType<typeof useCurveMonitorStore>,
  service: PriceService
) {
  // Unsubscribe from from existing subscriptions.
  if (prices$_) {
    prices$_.unsubscribe();
  }

  try {
    prices$_ = service.get$.subscribe({
      next: (price) => {
        store.addPrice(price);
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

let txs$_: Subscription | null = null;
export function getTransactions(
  store: ReturnType<typeof useCurveMonitorStore>,
  service: TransactionService
) {
  // Unsubscribe from from existing subscriptions.
  if (txs$_) {
    txs$_.unsubscribe();
  }

  try {
    txs$_ = service.get$.subscribe({
      next: (tx) => {
        store.addTransaction(tx);
      },
      error: (err) => console.error(err),
    });
  } catch (err) {
    store.poolsLoadingError = true;
  }
}
