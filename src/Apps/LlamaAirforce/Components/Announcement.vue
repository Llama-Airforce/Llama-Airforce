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

      <h1 v-html="t('announcement-viem')"></h1>
      <span>
        <a
          href="https://medium.com/@llamaairforce/viem-migration-27085915630f"
          target="_blank"
        >
          {{ t("link-viem") }}
        </a>
      </span>
    </div>
  </Card>
</template>

<script setup lang="ts">
const { t } = useI18n();
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.announcement-card {
  @include border(var(--c-yellow-rgb), true);
  margin: var(--dashboard-gap);
  margin-bottom: 0;

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
announcement-discord: We now have an official Discord server!
link-discord: You can read our announcement here.

announcement-viem: We have also migrated from Ethers to Viem!
link-viem: Read this announcement in case you're experiencing problems.
</i18n>

<i18n lang="yaml" locale="zh">
announcement-discord: 我们现在有了官方 Discord 服务器！
link-discord: 您可在此阅读我们的公告。

announcement-viem: 我们还从 Ethers 迁移到了 Viem !
link-viem: 如果您遇到问题，请阅读本公告。
</i18n>

<i18n lang="yaml" locale="fr">
announcement-discord: Nous avons maintenant un serveur Discord officiel !
link-discord: Vous pouvez lire notre annonce ici.

announcement-viem: Nous avons également migré d'Ethers vers Viem !
link-viem: Lisez cette annonce au cas où vous rencontreriez des problèmes.
</i18n>
