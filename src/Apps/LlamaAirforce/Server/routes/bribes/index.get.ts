const handler = defineEventHandler(async () => {
  const data = await $fetch("/bribes/votium/cvx-crv");
  return data;
});

export default handler;
