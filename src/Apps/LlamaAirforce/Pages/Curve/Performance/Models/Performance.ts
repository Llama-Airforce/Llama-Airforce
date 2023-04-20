export class PoolPerformance {
  curve: number;
  hodl: number;
  xyk: number;
  curve_rewards: number;
  timestamp: number;
}

export const EmptyPoolPerformance: PoolPerformance = {
  curve: 0,
  hodl: 0,
  xyk: 0,
  curve_rewards: 0,
  timestamp: 0,
};
