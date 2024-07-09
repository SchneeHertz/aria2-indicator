<template>
  <div class="task-detail-container">
    <n-card bordered>
      <n-grid x-gap="12" :cols="24">
        <n-gi :span="22">
          <n-grid x-gap="12" :cols="24">
              <n-gi :span="18" class="task-item">
                <n-text>{{ taskName }}</n-text>
              </n-gi>
              <n-gi :span="6" class="task-item">
                <n-text>{{ totalSize }}</n-text>
              </n-gi>
          </n-grid>
          <n-grid x-gap="12" :cols="24">
            <n-gi :span="24" class="task-item">
              <n-progress
                type="line"
                :percentage="progress"
                :indicator-placement="'inside'"
                processing
              />
            </n-gi>
          </n-grid>
          <n-grid x-gap="12" :cols="24">
            <n-gi :span="6" class="task-item">
              <n-text>{{ elapsedTime }}</n-text>
            </n-gi>
            <n-gi :span="12" class="task-item">
              <n-text>{{ connections }}</n-text>
            </n-gi>
            <n-gi :span="6" class="task-item">
              <n-text>{{ downloadSpeed }}</n-text>
            </n-gi>
          </n-grid>
        </n-gi>
        <n-gi :span="2">
          <n-button quaternary round type="error" @click="removeTask">
            <template #icon><n-icon><Delete /></n-icon></template>
          </n-button>
        </n-gi>
      </n-grid>
    </n-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { NCard, NGrid, NGi, NText, NButton, NIcon, NSpace, NProgress } from 'naive-ui'
import { Delete } from '@vicons/carbon'

const props = defineProps({
  task: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['removeTask'])

const taskName = computed(() => {
  return props.task.files?.[0]?.path?.split('/').pop() || 'Unknown'
})

const totalSize = computed(() => {
  return (props.task.totalLength / (1024 * 1024)).toFixed(2) + ' MB'
})

const progress = computed(() => {
  return ((props.task.completedLength / props.task.totalLength) * 100).toFixed(0)
})

const progressStatus = computed(() => {
  return 'active'
})

// 根据completedLength, totalLength和downloadSpeed算出剩余时间
const elapsedTime = computed(() => {
  const remaining = props.task.totalLength - props.task.completedLength
  const speed = props.task.downloadSpeed
  if (speed === 0) {
    return '∞'
  }
  const time = remaining / speed
  if (time < 60) {
    return time.toFixed(2) + 's'
  } else if (time < 3600) {
    return (time / 60).toFixed(2) + 'm'
  } else {
    return (time / 3600).toFixed(2) + 'h'
  }
})

const downloadSpeed = computed(() => {
  return (props.task.downloadSpeed / 1024).toFixed(2) + ' KB/s'
})

const connections = computed(() => {
  if (props.task.bittorrent) {
    return `${props.task.numSeeders || 0}/${props.task.connections || 0}`
  }
  return props.task.connections
})

const removeTask = () => {
  chrome.runtime.sendMessage({ type: 'removeTask', gid: props.task.gid })
  emit('removeTask', props.task.gid)
}

</script>

<style scoped>
.task-detail-container {
  padding: 4px;
}
</style>
