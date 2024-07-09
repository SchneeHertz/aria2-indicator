<script setup>
import Task from './components/Task.vue'
import { NEmpty } from 'naive-ui'
import { ref, onMounted, onBeforeUnmount } from 'vue'

const displayTask = ref([])
let updator = null
onMounted(() => {
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'activeDownload' || request.type === 'activeWaiting') {
      let tasks = JSON.parse(request.message)
      tasks.forEach(task => {
        let index = displayTask.value.findIndex(t => t.gid === task.gid)
        if (index === -1) {
          displayTask.value.push(task)
        } else {
          displayTask.value[index] = task
        }
      })
    } else if (request.type === 'stopped') {
      let tasks = JSON.parse(request.message)
      tasks.forEach(task => {
        let index = displayTask.value.findIndex(t => t.gid === task.gid)
        if (index !== -1) {
          displayTask.value.splice(index, 1)
        }
      })
    }
  })
  chrome.runtime.sendMessage({ type: 'requestCounts' })
  updator = setInterval(() => chrome.runtime.sendMessage({ type: 'requestCounts' }), 1000)
})

onBeforeUnmount(() => {
  clearInterval(updator)
})

const handleTaskRemove = (gid) => {
  let task = displayTask.value.findIndex(t => t.gid === gid)
  displayTask.value.splice(task, 1)
  chrome.runtime.sendMessage({ type: 'removeTask', gid })
}


</script>

<template>
  <n-empty v-if="displayTask.length === 0" description="No task" style="margin: 10px"/>
  <Task v-for="task in displayTask" :key="task.gid" :task="task" @remove-task="handleTaskRemove"/>
</template>