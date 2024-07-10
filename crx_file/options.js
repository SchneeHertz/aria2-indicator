document.addEventListener('DOMContentLoaded', function () {
  const wsUrlInput = document.getElementById('wsUrl')
  const tokenInput = document.getElementById('token')
  const saveBtn = document.getElementById('saveBtn')

  // 加载存储的WebSocket URL
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

  saveBtn.addEventListener('click', function () {
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
  })
})
