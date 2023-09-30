export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function minDelay<T>(x: Promise<T>, delay = 250): Promise<T> {
  const _minDelay = new Promise((resolve) =>
    setTimeout(() => {
      resolve(null);
    }, delay)
  );

  const [, resp] = await Promise.all([_minDelay, x]);

  return resp;
}
