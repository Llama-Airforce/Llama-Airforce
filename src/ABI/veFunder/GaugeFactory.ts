export const abi = [
  {
    stateMutability: "nonpayable",
    type: "function",
    name: "deploy_gauge",
    inputs: [
      { name: "_receiver", type: "address" },
      { name: "_max_emissions", type: "uint256" },
    ],
    outputs: [{ name: "", type: "address" }],
  },
] as const;
