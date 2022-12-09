export type ProposalDetails = {
  script: string;
  votes: {
    voter: string;
    supports: boolean;
    stake: number;
  }[];
};
