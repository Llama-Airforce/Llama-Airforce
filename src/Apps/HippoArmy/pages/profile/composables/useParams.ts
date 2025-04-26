export function useParams() {
  const { address } = useAccount();
  const user = useRouteQuery<string | undefined>(
    "user",
    address.value ?? undefined
  );
  const pairId = useRouteQuery<number | undefined>("pairId", undefined, {
    transform: Number,
  });

  return {
    user,
    pairId,
  };
}
