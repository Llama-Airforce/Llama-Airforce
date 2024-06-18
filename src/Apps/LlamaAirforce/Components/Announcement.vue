<template>
  <Card class="announcement">
    <h1 v-html="t('announcement')"></h1>
    <a
      href="https://medium.com/@llamaairforce/discord-7a6c25a2b454"
      target="_blank"
    >
      {{ t("link") }}
    </a>
  </Card>
</template>

<script setup lang="ts">
const { t } = useI18n();
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.announcement {
  @include border(var(--c-yellow-rgb), true);
  margin: var(--dashboard-gap);
  margin-bottom: 0;

  h1 {
    font-size: 1rem;
  }

  ::v-deep(.card-body) {
    display: flex;
    gap: 1ch;
    align-items: center;
  }
}
</style>

<i18n lang="yaml" locale="en">
announcement: We now have an official Discord server!
link: You can read our announcement here.
</i18n>

<i18n lang="yaml" locale="zh">
announcement: 我们现在有了官方 Discord 服务器！
link: 您可在此阅读我们的公告。
</i18n>

<i18n lang="yaml" locale="fr">
announcement: Nous avons maintenant un serveur Discord officiel !
link: Vous pouvez lire notre annonce ici.
</i18n>
