const handler = defineEventHandler(async () => {
  const data = await $fetch("/bribes/votium/cvx-crv/rounds");
  return data;
});

export default handler;
