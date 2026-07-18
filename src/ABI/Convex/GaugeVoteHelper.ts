export const abi = [
  {
    inputs: [
      { internalType: "uint256", name: "_proposalId", type: "uint256" },
      { internalType: "address", name: "_delegate", type: "address" },
      { internalType: "address[]", name: "_users", type: "address[]" },
      {
        internalType: "contract GaugeVotePlatform",
        name: "_gaugePlatform",
        type: "address",
      },
    ],
    name: "getContributingWeights",
    outputs: [{ internalType: "uint256[]", name: "weights", type: "uint256[]" }],
    stateMutability: "view",
    type: "function",
  },
] as const;
