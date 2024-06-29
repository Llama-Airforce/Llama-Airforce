type WriteContract = ReturnType<typeof useWriteContract>["writeContract"];

type ExecuteContractOptions = {
  /**
   * Message to display on successful transaction execution.
   * Can be a string or a function that returns a string.
   */
  successMessage?: string | (() => string);

  /**
   * Callback function to handle errors during transaction execution.
   * @param error - The error object thrown during execution.
   */
  onError?: (error: Error) => void;

  /**
   * Callback function to be called after successful transaction execution.
   */
  onSuccess?: () => void;

  /**
   * Flag to determine whether to show a success notification.
   * Defaults to true if not specified.
   */
  showSuccess?: boolean;
};

/**
 * Composable for executing smart contract transactions with error handling and success notifications.
 *
 * @template T - Array type for additional arguments passed to executeWrite
 * @param executeWrite - Function to execute the contract write operation
 * @param options - Optional. Options for handling success and error cases
 * @returns Object with execute function and isExecuting state
 */
export function useExecuteContract<T extends unknown[]>(
  executeWrite: (writeContract: WriteContract, ...args: T) => void,
  options?: ExecuteContractOptions
) {
  const {
    successMessage,
    onError,
    onSuccess,
    showSuccess = true,
  } = options ?? {};

  const { data: hash, error, isPending, writeContract } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash });

  const isExecuting = computed(() => isPending.value || isConfirming.value);

  const execute = (...args: T) => {
    try {
      executeWrite(writeContract, ...args);
    } catch (error) {
      notify({ text: prettyError(error), type: "error" });

      if (error instanceof Error) {
        onError?.(error);
      }
    }
  };

  watch(error, (newError) => {
    if (newError) {
      notify({ text: prettyError(newError), type: "error" });
      onError?.(newError);
    }
  });

  watch(isConfirmed, (newIsConfirmed) => {
    if (newIsConfirmed) {
      if (showSuccess) {
        notify({
          text:
            typeof successMessage === "function"
              ? successMessage()
              : successMessage ?? "Transaction has been successfully processed",
          type: "success",
        });
      }

      onSuccess?.();
    }
  });

  return {
    execute,
    isExecuting,
  };
}
