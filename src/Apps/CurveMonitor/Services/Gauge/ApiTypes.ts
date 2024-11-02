type Gauge = {
  address: string;
  gauge_type: string;
  name: string | null;
  version: string | null;
  lp_token: string | null;
  pool: {
    address: string;
    name: string;
    chain: string;
    tvl_usd: number;
    trading_volume_24h: number;
  } | null;
  tokens:
    | {
        symbol: string;
        address: string;
        precision: number;
      }[]
    | null;
  market: {
    name: string;
    chain: string;
  } | null;
  is_killed: boolean;
  emissions: number;
  gauge_weight: string;
  gauge_weight_7d_delta: number | null;
  gauge_weight_60d_delta: number | null;
  gauge_relative_weight: number;
  gauge_relative_weight_7d_delta: number | null;
  gauge_relative_weight_60d_delta: number | null;
  creation_tx: string;
  creation_date: string;
  last_vote_date: string | null;
  last_vote_tx: string | null;
};

export type GetGaugeResponse = Gauge;

export type GetGaugesResponse = {
  gauges: Gauge[];
};

export type GetVotesResponse = {
  votes: {
    user: string;
    weight: number;
    block_number: number;
    timestamp: string;
    transaction: string;
  }[];
};

export type GetWeightHistoryResponse = {
  data: {
    is_killed: boolean;
    gauge_weight: string;
    gauge_relative_weight: string;
    emissions: string;
    epoch: number;
  }[];
};

export type GetDeploymentResponse = {
  from_address: string;
  to_address: string | null;
  calldata: string;
  decoded_calldata: string | null;
  transaction_hash: string;
  block_number: number;
  dt: string;
};

export type GetUserGaugeVotesResponse = {
  votes: {
    gauge: string;
    gauge_name: string;
    weight: number;
    block_number: number;
    timestamp: string;
    transaction: string;
  }[];
};
