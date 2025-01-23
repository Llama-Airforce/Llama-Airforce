export type GetVotesOverviewResponse = {
  data: {
    proposals: number;
    prop_votes: number;
    prop_unique_voters: number;
    gauge_votes: number;
    epoch: number;
  }[];
};

export type GetLocksDailyResponse = {
  locks: {
    day: string;
    amount: string;
  }[];
};

export type GetSupplyResponse = {
  supply: {
    total_vecrv: string;
    escrowed_crv: string;
    crv_supply: string;
    circulating_supply: string;
    locked_supply_details: [
      {
        address: string;
        label: string;
        locked: string;
      }
    ];
    block_number: number;
    dt: string;
    transaction_hash: string;
  }[];
};

export type GetUserLocksResponse = {
  locks: {
    amount: string;
    unlock_time: number;
    lock_type: string;
    locked_balance: string;
    dt: string;
    transaction_hash: string;
  }[];
};

export type GetLockersResponse = {
  users: {
    user: string;
    locked: string;
    weight: string;
    weight_ratio: string;
    unlock_time: number;
  }[];
};
