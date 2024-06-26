export const abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_user",
        type: "address",
      },
    ],
    name: "lockedBalanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_user",
        type: "address",
      },
    ],
    name: "lockedBalances",
    outputs: [
      {
        internalType: "uint256",
        name: "total",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "unlockable",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "locked",
        type: "uint256",
      },
      {
        components: [
          {
            internalType: "uint112",
            name: "amount",
            type: "uint112",
          },
          {
            internalType: "uint112",
            name: "boosted",
            type: "uint112",
          },
          {
            internalType: "uint32",
            name: "unlockTime",
            type: "uint32",
          },
        ],
        internalType: "struct CvxLocker.LockedBalance[]",
        name: "lockData",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;
