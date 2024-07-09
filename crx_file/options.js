document.addEventListener('DOMContentLoaded', function () {
  const wsUrlInput = document.getElementById('wsUrl')
  const saveBtn = document.getElementById('saveBtn')

  // 加载存储的WebSocket URL
  chrome.storage.sync.get('wsUrl', function (data) {
    if (data.wsUrl) {
      wsUrlInput.value = data.wsUrl
    } else {
      wsUrlInput.value = 'ws://localhost:6800/jsonrpc'
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
  })
})
