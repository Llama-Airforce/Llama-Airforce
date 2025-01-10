import { abi as abiERC1155 } from "@/ABI/Standards/ERC1155";

export default function useApprovalForAll(owner: Ref<Address | undefined>) {
  const { data: isApprovedForAll, refetch: refetchIsApprovedForAll } =
    useReadContract({
      abi: abiERC1155,
      address: RPxCvxAddress,
      functionName: "isApprovedForAll",
      args: computed(() => [owner.value!, PirexCvxAddress] as const),
      query: {
        enabled: computed(() => !!owner.value),
        initialData: false,
        initialDataUpdatedAt: 0,
      },
    });

  const { execute: approve, isExecuting: approving } = useExecuteContract(
    (writeContract) => {
      writeContract({
        abi: abiERC1155,
        address: RPxCvxAddress,
        functionName: "setApprovalForAll",
        args: [PirexCvxAddress, true] as const,
      });
    },
    {
      successMessage: `Successfully approved futures claim zap!`,
      onSuccess: () => {
        void refetchIsApprovedForAll();
      },
    }
  );

  return {
    isApprovedForAll,
    approve,
    approving,
  };
}
