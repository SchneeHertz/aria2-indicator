let aria2 = { readyState: WebSocket.CLOSED }
let activeDownloads = 0
let activeSeeding = 0

let token = null
let wsUrl = "ws://localhost:6800/jsonrpc"
;(async () => {
  await chrome.storage.local.get(["wsUrl", "token"])
  .then((data) => {
    if (data.wsUrl) {
      wsUrl = data.wsUrl
    }
    if (data.token) {
      token = data.token
    }
    initializeWebSocket()
  })
})()

const getActiveDownload = () => ({
  jsonrpc: "2.0",
  method: "aria2.tellActive",
  id: "activeDownload",
  params: [`token:${token}`]
})

const getActiveDownloadFromPopup = () => ({
  jsonrpc: "2.0",
  method: "aria2.tellActive",
  id: "activeDownloadFromPopup",
  params: [`token:${token}`]
})

const getActiveWaitingFromPopup = () => ({
  jsonrpc: "2.0",
  method: "aria2.tellWaiting",
  id: "activeWaitingFromPopup",
  params: [`token:${token}`, 0, 1000]
})

const getStoppedFromPopup = () => ({
  jsonrpc: "2.0",
  method: "aria2.tellStopped",
  id: "stoppedFromPopup",
  params: [`token:${token}`, 0, 1000]
})

// 设置周期性任务
chrome.alarms.create("updateTaskCounts", { periodInMinutes: 0.25 })

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "updateTaskCounts") {
    requestCounts()
  }
})

const requestCounts = (fromPopup) => {
  // 检查WebSocket连接状态
  if (aria2.readyState === WebSocket.CLOSED || aria2.readyState === WebSocket.CLOSING) {
    console.log("WebSocket is not open. connecting...")
    initializeWebSocket()
  } else if (aria2.readyState === WebSocket.OPEN) {
    if (fromPopup) {
      aria2.send(JSON.stringify(getActiveDownloadFromPopup()))
      aria2.send(JSON.stringify(getActiveWaitingFromPopup()))
      aria2.send(JSON.stringify(getStoppedFromPopup()))
    } else {
      aria2.send(JSON.stringify(getActiveDownload()))
    }
  } else {
    console.log("WebSocket is still connecting...")
  }
}

const initializeWebSocket = async () => {

  aria2 = new WebSocket(wsUrl)

  aria2.onopen = () => requestCounts()

  aria2.onmessage = (event) => {
    const response = JSON.parse(event.data)
    if (response.id === "activeDownload" || response.id === "activeDownloadFromPopup") {
      let activeDownloadTasks = response.result.filter(task => task.seeder === "false" || task.seeder === undefined)
      let activeSeedingTasks = response.result.filter(task => task.seeder === "true")
      activeDownloads = activeDownloadTasks.length
      activeSeeding = activeSeedingTasks.length
      updateBadge()
      if (response.id === "activeDownloadFromPopup") chrome.runtime.sendMessage({ type: 'activeDownload', message: JSON.stringify(response.result) })
    } else if (response.id === "activeWaitingFromPopup") {
      chrome.runtime.sendMessage({ type: 'activeWaiting', message: JSON.stringify(response.result) })
    } else if (response.id === "stoppedFromPopup") {
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

chrome.storage.onChanged.addListener((changes, namespace) => {
  for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
    if (key === "wsUrl" && oldValue !== newValue) {
      console.log("WebSocket URL changed from", oldValue, "to", newValue)
      aria2.close()
      wsUrl = newValue
      initializeWebSocket()
    } else if (key === "token" && oldValue !== newValue) {
      console.log("Token changed from", oldValue, "to", newValue)
      token = newValue
    }
  }
})

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'requestCounts') {
    requestCounts(true)
  } else if (request.type === 'removeTask') {
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
  } else if (activeSeeding > 0) {
    chrome.action.setBadgeText({ text: activeSeeding.toString() })
    chrome.action.setBadgeBackgroundColor({ color: [144, 238, 144, 255] }); // 浅绿色
  } else {
    chrome.action.setBadgeText({ text: '' })
  }
}
