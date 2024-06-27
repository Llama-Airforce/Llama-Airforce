type WriteContract = ReturnType<typeof useWriteContract>["writeContract"];

/**
 * Composable for executing smart contract transactions with error handling and success notifications.
 *
 * @template T - Array type for additional arguments passed to executeWrite
 * @param executeWrite - Function to execute the contract write operation
 * @param successMessage - Message to display on successful transaction
 * @param onError - Callback function to handle errors
 * @param onSuccess - Callback function to execute on successful transaction
 * @returns Object with execute function and isExecuting state
 */
export function useExecuteContract<T extends unknown[]>(
  executeWrite: (writeContract: WriteContract, ...args: T) => void,
  successMessage?: string | (() => string),
  onError?: (error: Error) => void,
  onSuccess?: () => void
) {
  const { data: hash, error, isPending, writeContract } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash });

  const isExecuting = computed(() => isPending.value || isConfirming.value);

  const execute = (...args: T) => {
    executeWrite(writeContract, ...args);
  };

  watch(error, (newError) => {
    if (newError) {
      notify({ text: prettyError(newError), type: "error" });
      onError?.(newError);
    }
  });

  watch(isConfirmed, (newIsConfirmed) => {
    if (newIsConfirmed) {
      notify({
        text:
          typeof successMessage === "function"
            ? successMessage()
            : successMessage ?? "Transaction has been successfully processed",
        type: "success",
      });
      onSuccess?.();
    }
  });

  return {
    execute,
    isExecuting,
  };
}
