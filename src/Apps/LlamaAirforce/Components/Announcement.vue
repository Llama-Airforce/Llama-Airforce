<script setup lang="ts">
const { t } = useI18n();
</script>

<template>
  <Card class="announcement-card">
    <div class="announcements">
      <h1 v-html="t('announcement-discord')"></h1>
      <span>
        <a
          href="https://medium.com/@llamaairforce/discord-7a6c25a2b454"
          target="_blank"
        >
          {{ t("link-discord") }}
        </a>
      </span>
    </div>
  </Card>
</template>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.announcement-card {
  margin: var(--dashboard-gap);
  margin-bottom: 0;

  @include border(var(--c-yellow-rgb), true);

  .announcements {
    flex-grow: 1;

    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1ch;

    h1 {
      margin: 0;
      font-size: 1rem;
    }

    span {
      display: flex;
      justify-content: end;
    }
  }
}
</style>

<i18n lang="yaml" locale="en">
announcement-discord: Join our official Discord server for emotional and tech support!
link-discord: You can read our announcement here.
</i18n>

<i18n lang="yaml" locale="zh">
announcement-discord: 加入我们的官方 Discord 服务器，获取情感和技术支持！
link-discord: 您可在此阅读我们的公告。
</i18n>

<i18n lang="yaml" locale="fr">
announcement-discord: Rejoignez notre serveur Discord officiel pour un soutien émotionnel et technique !
link-discord: Vous pouvez lire notre annonce ici.
</i18n>
