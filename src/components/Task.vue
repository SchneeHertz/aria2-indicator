<template>
  <div class="task-detail-container">
    <n-card bordered content-style="padding: 4px">
      <n-grid x-gap="12" :cols="24">
        <n-gi :span="20" class="task-item">
          <n-text>{{ taskName }}</n-text>
        </n-gi>
        <n-gi :span="4" class="task-item">
          <n-flex justify="right">
            <n-button text class="task-button" type="error" @click="removeTask">
              <n-icon>
                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32"><path d="M12 12h2v12h-2z" fill="currentColor"></path><path d="M18 12h2v12h-2z" fill="currentColor"></path><path d="M4 6v2h2v20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8h2V6zm4 22V8h16v20z" fill="currentColor"></path><path d="M12 2h8v2h-8z" fill="currentColor"></path></svg>
              </n-icon>
            </n-button>
          </n-flex>
        </n-gi>
        <n-gi :span="19" class="task-item">
          <n-progress
            type="line"
            :percentage="progress"
            :indicator-placement="'inside'"
            :processing="status === 'default' || status === 'success'"
            :status="status"
          />
        </n-gi>
        <n-gi :span="5" class="task-item" style="margin-top: -3px">
          <n-text>{{ totalSize }}</n-text>
        </n-gi>
        <n-gi :span="24" class="task-item">
          <n-flex justify="right">
            <n-text class="task-info" v-if="status === 'default'">{{ elapsedTime }}</n-text>
            <n-text class="task-info">{{ connections }}</n-text>
            <n-text class="task-info" v-if="+task.downloadSpeed">↓ {{ downloadSpeed }}</n-text>
            <n-text class="task-info" v-if="+task.uploadSpeed">↑ {{ uploadSpeed }}</n-text>
          </n-flex>
        </n-gi>
      </n-grid>
    </n-card>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { NCard, NGrid, NGi, NText, NButton, NIcon, NFlex, NProgress } from 'naive-ui'

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
  return ((+props.task.totalLength) / (1024 * 1024)).toFixed(2) + ' MB'
})

const progress = computed(() => {
  return Number((((+props.task.completedLength) / (+props.task.totalLength || 1)) * 100).toFixed(2))
})

const status = computed(() => {
  switch (props.task.status) {
    case 'active':
      switch (props.task.seeder) {
        case "true":
          return 'success'
        case "false":
        default:
          return 'default'
      }
    case 'paused':
    case 'waiting':
      return 'warning'
    default:
      return 'error'
  }
})

// 根据completedLength, totalLength和downloadSpeed算出剩余时间
const elapsedTime = computed(() => {
  const remaining = (+props.task.totalLength) - (+props.task.completedLength)
  const speed = +props.task.downloadSpeed
  if (speed === 0) {
    return '∞'
  }
  const time = remaining / speed
  if (time < 60) {
    return time.toFixed(0) + 's'
  } else if (time < 3600) {
    return (time / 60).toFixed(0) + 'm'
  }
})

const downloadSpeed = computed(() => {
  return ((+props.task.downloadSpeed) / 1024).toFixed(2) + ' KB/s'
})

const uploadSpeed = computed(() => {
  return ((+props.task.uploadSpeed) / 1024).toFixed(2) + ' KB/s'
})

const connections = computed(() => {
  if (props.task.bittorrent) {
    return `${props.task.numSeeders || 0}/${props.task.connections || 0}`
  }
  return props.task.connections
})

const removeTask = () => {
  emit('removeTask', props.task.gid)
}

</script>

<style scoped>
.task-detail-container {
  padding: 4px;
}
.task-button {
  font-size: 22px;
  margin-right: 4px;
  margin-bottom: 4px;
}
.task-info {
  padding-right: 8px;
}
</style>
