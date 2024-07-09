let aria2 = { readyState: WebSocket.CLOSED }
let activeDownloads = 0
let activeWaiting = 0

const getActiveDownloads = {
  jsonrpc: "2.0",
  method: "aria2.tellActive",
  id: "activeDownload"
}

const getActiveWating = {
  jsonrpc: "2.0",
  method: "aria2.tellWaiting",
  id: "activeWaiting",
  params: [0, 1000]
}

const getStopped = {
  jsonrpc: "2.0",
  method: "aria2.tellStopped",
  id: "stopped",
  params: [0, 1000]
}

// 设置周期性任务
chrome.alarms.create("updateTaskCounts", { periodInMinutes: 0.25 })

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "updateTaskCounts") {
    requestCounts()
  }
})

const requestCounts = () => {
  // 检查WebSocket连接状态
  if (aria2.readyState === WebSocket.CLOSED || aria2.readyState === WebSocket.CLOSING) {
    console.log("WebSocket is not open. connecting...")
    initializeWebSocket()
  } else if (aria2.readyState === WebSocket.OPEN) {
    aria2.send(JSON.stringify(getActiveDownloads))
    aria2.send(JSON.stringify(getActiveWating))
    aria2.send(JSON.stringify(getStopped))
  } else {
    console.log("WebSocket is still connecting...")
  }
}

const initializeWebSocket = async () => {
  let wsUrl = "ws://localhost:6800/jsonrpc"

  await chrome.storage.local.get("wsUrl")
  .then((data) => {
    if (data.wsUrl) {
      wsUrl = data.wsUrl
    }
  })
  aria2 = new WebSocket(wsUrl)

  aria2.onopen = () => {
    requestCounts()
  }

  aria2.onmessage = (event) => {
    const response = JSON.parse(event.data)
    console.log(response)
    if (response.id === "activeDownload") {
      activeDownloads = response.result.length
      updateBadge()
      chrome.runtime.sendMessage({ type: 'activeDownload', message: JSON.stringify(response.result) })
    } else if (response.id === "activeWaiting") {
      activeWaiting = response.result.length
      updateBadge()
      chrome.runtime.sendMessage({ type: 'activeWaiting', message: JSON.stringify(response.result) })
    } else if (response.id === "stopped") {
      chrome.runtime.sendMessage({ type: 'stopped', message: JSON.stringify(response.result) })
    } else {
      requestCounts()
    }
  }

  aria2.onclose = () => {
    console.log("WebSocket connection closed")
    chrome.action.setBadgeText({ text: '' })
  }

  aria2.onerror = (error) => {
    console.error("WebSocket error:", error)
    chrome.action.setBadgeText({ text: '' })
  }
}

initializeWebSocket()

chrome.storage.onChanged.addListener((changes, namespace) => {
  for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
    if (key === "wsUrl" && oldValue !== newValue) {
      console.log("WebSocket URL changed from", oldValue, "to", newValue)
      aria2.close()
      initializeWebSocket()
    }
  }
})

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'requestCounts') {
    requestCounts()
  } else if (request.type === 'removeTask') {
    console.log(request.gid)
    aria2.send(JSON.stringify({
      jsonrpc: "2.0",
      method: "aria2.remove",
      id: "removeTask",
      params: [request.gid]
    }))
  }
  return true // 表示将继续处理响应
})

const updateBadge = () => {
  if (activeDownloads > 0) {
    chrome.action.setBadgeText({ text: activeDownloads.toString() })
    chrome.action.setBadgeBackgroundColor({ color: [135, 206, 235, 255] }) // 天蓝色
  } else if (activeWaiting > 0) {
    chrome.action.setBadgeText({ text: activeWaiting.toString() })
    chrome.action.setBadgeBackgroundColor({ color: [144, 238, 144, 255] }); // 浅绿色
  } else {
    chrome.action.setBadgeText({ text: '' })
  }
}
