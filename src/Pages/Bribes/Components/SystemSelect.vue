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
          <img :src="icon(props.item)" />
          <div class="label">{{ label(props.item) }}</div>
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
          <img :src="icon(props.item)" />
          <div class="label">{{ label(props.item) }}</div>
        </div>
      </template>
    </Select>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { $ref, $computed } from "vue/macros";
import { useI18n } from "vue-i18n";
import { Select } from "@/Framework";
import { notEmpty } from "@/Util";
import { useBribesStore } from "@/Pages/Bribes/Store";
import {
  getProtocols,
  type Protocol,
  type Platform,
} from "@/Pages/Bribes/Models";

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
  (e: "select-platform", platform: Platform): void;
  (e: "select-protocol", protocol: Protocol): void;
}>();

// Refs
const store = useBribesStore();

let platformOpen = $ref(false);
let protocolOpen = $ref(false);

let platformSelected = $ref(false);
let protocolSelected = $ref(false);

const platforms = $computed((): PlatformInfo[] => {
  return [
    { platform: "votium", label: "Votium", logo: "votium.png" },
    { platform: "hh", label: "Hidden Hand", logo: "redacted.png" },
  ];
});

const protocols = $computed((): ProtocolInfo[] => {
  const protocols: ProtocolInfo[] = [
    { protocol: "cvx-crv", label: "vlCVX", logo: "cvx.svg" },
    { protocol: "aura-bal", label: "AURA", logo: "aura.png" },
  ];

  return getProtocols(platform?.platform)
    .map((protocol) => protocols.find((p) => p.protocol === protocol))
    .filter(notEmpty);
});

const platform = $computed((): PlatformInfo | null => {
  return platforms.find((p) => p.platform === store.selectedPlatform) ?? null;
});

const protocol = $computed((): ProtocolInfo | null => {
  return protocols.find((p) => p.protocol === store.selectedProtocol) ?? null;
});

// Hooks
onMounted((): void => {
  onPlatformSelect(platforms[0]);
  onProtocolSelect(protocols[0]);

  platformSelected = false;
  protocolSelected = false;
});

// Methods
const label = (item: SelectItem): string => {
  return item.label;
};

const icon = (item: SelectItem): string => {
  return `icons/${item.logo}`;
};

// Events
const onPlatformOpen = (): void => {
  if (platformSelected) {
    platformSelected = false;
    return;
  }

  platformOpen = !platformOpen;
};

const onPlatformSelect = (option: unknown): void => {
  const { platform } = option as PlatformInfo;

  platformOpen = false;
  platformSelected = true;
  emit("select-platform", platform);

  onProtocolSelect(protocols[0]);
  protocolSelected = false;
};

const onProtocolOpen = (): void => {
  if (protocolSelected) {
    protocolSelected = false;
    return;
  }

  protocolOpen = !protocolOpen;
};

const onProtocolSelect = (option: unknown): void => {
  const { protocol } = option as ProtocolInfo;

  protocolOpen = false;
  protocolSelected = true;
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
