<script setup lang="ts">
import { SpeedInsights } from "@vercel/speed-insights/nuxt"
</script>

<template>
  <nuxt-layout>
    <SpeedInsights />
    <nuxt-page :key="$route.path" />
  </nuxt-layout>
</template>
