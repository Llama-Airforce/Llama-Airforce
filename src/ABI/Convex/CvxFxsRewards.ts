export const abi = [
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "rewardData",
    outputs: [
      { internalType: "uint256", name: "periodFinish", type: "uint256" },
      { internalType: "uint256", name: "rewardRate", type: "uint256" },
      {
        internalType: "uint256",
        name: "lastUpdateTime",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "rewardPerTokenStored",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;
