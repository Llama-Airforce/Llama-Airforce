export const abi = [
  {
    inputs: [{ internalType: "address", name: "_account", type: "address" }],
    name: "accountExtraRewardRates",
    outputs: [
      { internalType: "address[]", name: "tokens", type: "address[]" },
      { internalType: "uint256[]", name: "rates", type: "uint256[]" },
      { internalType: "uint256[]", name: "groups", type: "uint256[]" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_account", type: "address" }],
    name: "accountRewardRates",
    outputs: [
      { internalType: "address[]", name: "tokens", type: "address[]" },
      { internalType: "uint256[]", name: "rates", type: "uint256[]" },
      { internalType: "uint256[]", name: "groups", type: "uint256[]" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_rate", type: "uint256" },
      {
        internalType: "uint256",
        name: "_priceOfReward",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_priceOfDeposit",
        type: "uint256",
      },
    ],
    name: "apr",
    outputs: [{ internalType: "uint256", name: "_apr", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "extraRewardRates",
    outputs: [
      { internalType: "address[]", name: "tokens", type: "address[]" },
      { internalType: "uint256[]", name: "rates", type: "uint256[]" },
      { internalType: "uint256[]", name: "groups", type: "uint256[]" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "mainRewardRates",
    outputs: [
      { internalType: "address[]", name: "tokens", type: "address[]" },
      { internalType: "uint256[]", name: "rates", type: "uint256[]" },
      { internalType: "uint256[]", name: "groups", type: "uint256[]" },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;
