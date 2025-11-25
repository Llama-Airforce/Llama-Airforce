export const abi = [
  {
    stateMutability: "view",
    type: "function",
    name: "getLocksByOwner",
    inputs: [{ name: "owner_", type: "address" }],
    outputs: [{
      name: "results",
      type: "tuple[]",
      components: [
        {
          name: "owner",
          type: "address"
        },
        {
          name: "lockedAt",
          type: "uint256"
        },
        {
          name: "tokenId",
          type: "uint256"
        },
      ],
    }]
  }
] as const;
