<script setup lang="ts">
import MigrateStkCvxPrisma from "@Pounders/Components/Migrations/MigrateStkCvxPrisma.vue";
import MigrateUBal from "@Pounders/Components/Migrations/MigrateUBal.vue";
import MigrateUCrv from "@Pounders/Components/Migrations/MigrateUCrv.vue";
import MigrateUCrvV2 from "@Pounders/Components/Migrations/MigrateUCrvV2.vue";
import MigrateUFxs from "@Pounders/Components/Migrations/MigrateUFxs.vue";
</script>

<template>
  <MigrateUCrvV2 />
  <MigrateUCrv />
  <MigrateUBal />
  <MigrateUFxs />
  <MigrateStkCvxPrisma />
</template>
