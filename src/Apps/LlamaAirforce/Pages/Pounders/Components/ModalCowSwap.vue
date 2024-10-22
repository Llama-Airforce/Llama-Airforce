<script setup lang="ts">
import type { Swap } from "@Pounders/Models";
import CowSwap from "@LAF/Components/CowSwap.vue";

const { t } = useI18n();

const { swap } = defineProps<{
  swap: Swap | null;
}>();

const emit = defineEmits<{
  close: [];
}>();
</script>

<template>
  <Modal @close="emit('close')">
    <Card :title="t('swap')">
      <div class="content">
        <div class="info">
          {{ t("swap-info") }}
        </div>

        <div class="swap">
          <CowSwap
            class="cow"
            :level="1"
            :buy="swap?.buy ?? 'ETH'"
            :sell="swap?.sell ?? 'USDC'"
          />
        </div>
      </div>
    </Card>
  </Modal>
</template>

<style scoped>
.content {
  width: 33vw;
  display: flex;
  flex-direction: column;
  gap: var(--dashboard-gap);

  @media only screen and (max-width: 1280px) {
    width: 90vw;
  }
}

.cow {
  margin-top: 2rem;
}

.info {
  color: #a1a1aa;
}
</style>

<i18n lang="yaml" locale="en">
information: Information
swap: Swap
swap-info: The preferred method for depositing is using the available zaps from the dropdown menu. If your preferred token is not listed, we recommend using the CoWSwap widget for MEV-protected trading with optimal routing into the native pounder token, which you can then deposit. Although this two-step process might be a bit cumbersome, it ensures your safety. The same method applies for withdrawing from the pounder.
</i18n>

<i18n lang="yaml" locale="zh">
information: 信息
swap: 交换
swap-info: 存款的首选方法是使用下拉菜单中的可用 Zaps。如果您首选的代币没有列出，我们建议您使用 CoWSwap 小工具进行 MEV 保护交易，并将其优化路由到本地 pounder 代币，然后再存入。虽然这两个步骤可能有点繁琐，但可以确保您的安全。同样的方法也适用于从 pounder 取款。
</i18n>

<i18n lang="yaml" locale="fr">
information: Informations
swap: Échange
swap-info: La méthode préférée pour le dépôt est l'utilisation des zaps disponibles à partir du menu déroulant. Si votre jeton préféré ne figure pas dans la liste, nous vous recommandons d'utiliser le widget CoWSwap pour un échange protégé par MEV avec un acheminement optimal vers le jeton pounder natif, que vous pouvez ensuite déposer. Bien que ce processus en deux étapes puisse être un peu lourd, il garantit votre sécurité. La même méthode s'applique pour le retrait du pounder.
</i18n>
