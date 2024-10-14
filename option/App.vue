<script setup>
import { ref, onMounted } from 'vue'
import { NInput, NButton, NForm, NFormItem } from 'naive-ui'

const wsUrlInput = ref('')
const tokenInput = ref('')

onMounted(() => {
  chrome.storage.local.get(['wsUrl', 'token'], function (data) {
    if (data.wsUrl) {
      wsUrlInput.value = data.wsUrl
    } else {
      wsUrlInput.value = 'ws://localhost:6800/jsonrpc'
    }
    if (data.token) {
      tokenInput.value = data.token
    }
  })
})

const save = () => {
  const wsUrl = wsUrlInput.value
  if (wsUrl) {
    chrome.storage.local.set({ wsUrl: wsUrl }, function () {
      console.log('WebSocket URL saved:', wsUrl)
      alert('Settings saved')
    })
  } else {
    alert('Please enter a valid WebSocket URL')
  }
  const token = tokenInput.value
  if (token) {
    chrome.storage.local.set({ token: token }, function () {
      console.log('Token saved:', token)
    })
  }
}


</script>

<template>
  <n-form style="margin: auto; width: 50vw; padding: 40px">
    <h2>Extension Options</h2>
    <n-form-item label="WebSocket URL:">
      <n-input v-model:value="wsUrlInput" placeholder="ws://localhost:6800/jsonrpc" />
    </n-form-item>
    <n-form-item label="RPC Secret:">
      <n-input v-model:value="tokenInput" placeholder="token" />
    </n-form-item>
    <n-button type="primary" @click="save">Save</n-button>
  </n-form>
</template>