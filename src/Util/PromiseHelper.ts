export async function minDelay<T>(x: Promise<T>, delay = 250): Promise<T> {
  const _minDelay = new Promise(res =>
    setTimeout(() => {
      res(null);
    }, delay)
  );

  const [, resp] = await Promise.all([_minDelay, x]);

  return resp;
}
