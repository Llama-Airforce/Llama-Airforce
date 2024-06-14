export const abi = [
  {
    name: "balanceOfAt",
    outputs: [{ type: "uint256", name: "" }],
    inputs: [
      { type: "address", name: "addr" },
      { type: "uint256", name: "_block" },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;
