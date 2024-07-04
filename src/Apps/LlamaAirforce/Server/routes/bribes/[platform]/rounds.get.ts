const handler = defineCachedEventHandler(
  async () => {
    const data = await $fetch("/bribes/votium/cvx-crv/rounds");
    return data;
  },
  { maxAge: 60 }
);

export default handler;
