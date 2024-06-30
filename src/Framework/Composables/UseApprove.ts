import { erc20Abi as abi, maxUint256 } from "viem";

/** Options for the approval process */
type ApproveOptions = {
  /** If true, approves the maximum possible amount */
  maxApprove?: boolean;
};

/**
 * A composable function to handle ERC20 token approvals
 *
 * @param token The address of the ERC20 token
 * @param owner A reactive reference to the address of the token owner
 * @param spender The address of the account to be approved for spending
 * @param amount A reactive reference to the amount to be approved
 * @param options Optional. Additional options for the approval process
 * @returns An object containing approval-related functions and state
 */
export function useApprove(
  token: Ref<Address> | Address,
  owner: Ref<Address | undefined>,
  spender: Address,
  amount: Ref<bigint | undefined>,
  options?: ApproveOptions
) {
  const { maxApprove = true } = options ?? {};

  // Determine if the allowance can be fetched based on the owner's address
  const canRefetch = computed(() => !!owner.value);

  // Fetch the current allowance from the token contract
  const { data: allowance, refetch } = useReadContract({
    abi,
    address: token,
    functionName: "allowance",
    args: computed(() => [owner.value!, spender] as const),
    query: {
      enabled: canRefetch,
      initialData: 0n,
      initialDataUpdatedAt: 0,
    },
  });

  // Compute whether an approval is needed based on the current allowance and requested amount
  const needsApprove = computed(() => {
    if (allowance.value === undefined || !canRefetch.value) {
      return false;
    }

    const currentAmount = amount.value ?? 0n;
    return allowance.value < currentAmount;
  });

  // Watch for changes in the amount and refetch the allowance after a short delay
  watchDebounced(
    amount,
    () => {
      if (canRefetch.value) {
        void refetch();
      }
    },
    { debounce: 200 }
  );

  // Set up the approval function using useExecuteContract
  const { execute: approve, isExecuting: isApproving } = useExecuteContract(
    (writeContract) => {
      // Determine the amount to approve (max or specified amount)
      const spendAmount = maxApprove ? maxUint256 : amount.value;

      if (!spendAmount) {
        throw new Error("No approval spend amount given.");
      }

      writeContract({
        abi,
        address: unref(token),
        functionName: "approve",
        args: [spender, spendAmount] as const,
      });
    },
    {
      // Refetch the allowance after a successful approval
      onSuccess: () => {
        if (canRefetch.value) {
          void refetch();
        }
      },
      showSuccess: false,
    }
  );

  return {
    allowance,
    needsApprove,
    approve,
    isApproving,
  };
}
