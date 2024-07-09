const handler = defineCachedEventHandler(
  async () => {
    const data = await $fetch("/bribes/votium/cvx-crv");
    return data;
  },
  { maxAge: 60 }
);

export default handler;
