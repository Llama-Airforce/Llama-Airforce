export type GetUserGaugeVotes = {
  votes: {
    gauge: string;
    gauge_name: string;
    weight: number;
    block_number: number;
    timestamp: string;
    transaction: string;
  }[];
};
