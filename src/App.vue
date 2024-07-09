<script setup>
import Task from './components/Task.vue'
import { NButton } from 'naive-ui'

import { ref } from 'vue'

const count = ref(0)
const increment = () => {
  count.value++
}
</script>

<template>
  <div>
    <NButton @click="increment">Count: {{ count }}</NButton>
  </div>
</template>

<style scoped>
</style>
