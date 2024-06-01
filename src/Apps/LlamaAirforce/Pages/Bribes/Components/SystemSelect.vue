<template>
  <div class="system-selector">
    <Select
      class="platform"
      :label="t('platform')"
      :options="platforms"
      :selected="platform"
      :open="platformOpen"
      @open="onPlatformOpen"
      @close="platformOpen = false"
      @input="onPlatformSelect"
    >
      <template #item="props: { item: PlatformInfo }">
        <div
          v-if="props.item"
          class="item"
        >
          <img :src="props.item.logo" />
          <div class="label">{{ props.item.label }}</div>
        </div>
      </template>
    </Select>

    <Select
      class="protocol"
      :label="t('protocol')"
      :options="protocols"
      :selected="protocol"
      :open="protocolOpen"
      @open="onProtocolOpen"
      @close="protocolOpen = false"
      @input="onProtocolSelect"
    >
      <template #item="props: { item: SelectItem }">
        <div
          v-if="props.item"
          class="item"
        >
          <img :src="props.item.logo" />
          <div class="label">{{ props.item.label }}</div>
        </div>
      </template>
    </Select>
  </div>
</template>

<script setup lang="ts">
import { useBribesStore } from "@LAF/Pages/Bribes/Store";
import { type Protocol, type Platform } from "@LAF/Pages/Bribes/Models";

const { t } = useI18n();

type SelectItem = {
  label: string;
  logo: string;
};

type PlatformInfo = SelectItem & {
  platform: Platform;
};

type ProtocolInfo = SelectItem & {
  protocol: Protocol;
};

// Emits
const emit = defineEmits<{
  "select-platform": [platform: Platform];
  "select-protocol": [protocol: Protocol];
}>();

// Refs
const store = useBribesStore();

const platformOpen = ref(false);
const protocolOpen = ref(false);

const platformSelected = ref(false);
const protocolSelected = ref(false);

import votium from "@/Assets/Icons/Tokens/votium.png";
import redacted from "@/Assets/Icons/Tokens/redacted.png";

const platforms = computed((): PlatformInfo[] => {
  return [
    { platform: "votium", label: "Votium", logo: votium },
    { platform: "hh", label: "Hidden Hand", logo: redacted },
  ];
});

const platform = computed((): PlatformInfo | null => {
  return platforms.value.find((p) => p.platform === store.platform) ?? null;
});

const protocol = computed((): ProtocolInfo | null => {
  return protocols.value.find((p) => p.protocol === store.protocol) ?? null;
});

import crv from "@/Assets/Icons/Tokens/crv.svg";
import prisma from "@/Assets/Icons/Tokens/prisma.svg";
import fxn from "@/Assets/Icons/Tokens/fxn.svg";
import aura from "@/Assets/Icons/Tokens/aura.png";

const protocols = computed((): ProtocolInfo[] => {
  return [
    { protocol: "cvx-crv", label: "Curve", logo: crv },
    { protocol: "cvx-prisma", label: "Prisma", logo: prisma },
    { protocol: "cvx-fxn", label: "f(x) Protocol", logo: fxn },
    { protocol: "aura-bal", label: "Aura", logo: aura },
  ];
});

// Hooks
onMounted((): void => {
  platformSelected.value = false;
  protocolSelected.value = false;
});

// Events
const onPlatformOpen = (): void => {
  if (platformSelected.value) {
    platformSelected.value = false;
    return;
  }

  platformOpen.value = !platformOpen.value;
};

const onPlatformSelect = (option: PlatformInfo): void => {
  const { platform } = option;

  platformOpen.value = false;
  platformSelected.value = true;
  emit("select-platform", platform);

  onProtocolSelect(protocols.value[0]);
  protocolSelected.value = false;
};

const onProtocolOpen = (): void => {
  if (protocolSelected.value) {
    protocolSelected.value = false;
    return;
  }

  protocolOpen.value = !protocolOpen.value;
};

const onProtocolSelect = (option: ProtocolInfo): void => {
  const { protocol } = option;

  protocolOpen.value = false;
  protocolSelected.value = true;
  emit("select-protocol", protocol);
};
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.system-selector {
  display: flex;
  justify-content: space-evenly;
  flex-grow: 1;
  gap: 1.5rem;

  @media only screen and (max-width: 1280px) {
    display: grid;
    grid-template-rows: auto;
    grid-template-columns: 1fr 1fr;

    > .platform {
      grid-row: 1;
      grid-column: 1;
    }

    > .protocol {
      grid-row: 1;
      grid-column: 2;
    }
  }

  ::v-deep(.platform),
  ::v-deep(.protocol) {
    flex-grow: 1;
    flex-basis: 0;

    .select {
      > .selected > .item,
      > .items {
        font-size: 1.25rem;
        font-weight: 700;
      }

      > .items {
        margin-top: 3.75rem;
        line-height: 1.75rem;
      }
    }

    .item {
      display: flex;
      align-items: center;

      img {
        width: 20px;
        height: 20px;
        object-fit: scale-down;
      }

      > .label {
        font-size: 0.875rem;
        margin-left: 0.75rem;
      }
    }
  }
}
</style>

<i18n lang="yaml" locale="en">
platform: Platform
protocol: Protocol
</i18n>

<i18n lang="yaml" locale="zh">
platform: 平台
protocol: 协议
</i18n>
