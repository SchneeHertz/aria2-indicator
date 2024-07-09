const WS_URL = "ws://localhost:6800/jsonrpc"
let aria2 = new WebSocket(WS_URL)

// 存储活动的下载和做种任务计数
let activeDownloads = 0
let activeSeeding = 0

const getActiveDownloads = {
  jsonrpc: "2.0",
  method: "aria2.tellActive",
  id: "activeDownload"
}

const getActiveSeeding = {
  jsonrpc: "2.0",
  method: "aria2.tellWaiting",
  id: "activeSeeding",
  params: [0, 1000]  // 假设最大同时做种的任务数为1000
}

aria2.onopen = function () {
  requestCounts()
}

// 设置周期性任务
chrome.alarms.create("updateTaskCounts", { periodInMinutes: 0.25 })

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "updateTaskCounts") {
    requestCounts()
  }
})

aria2.onmessage = function (event) {
  const response = JSON.parse(event.data)
  console.log(response)
  if (response.id === "activeDownload") {
    activeDownloads = response.result.length
    updateBadge()
  } else if (response.id === "activeSeeding") {
    activeSeeding = response.result.length
    updateBadge()
  } else {
    requestCounts()
  }
}

aria2.onclose = function () {
  console.log("WebSocket connection closed")
  setTimeout(() => {
    aria2 = new WebSocket(WS_URL)
    aria2.onopen = requestCounts
  }, 1000)  // 尝试重连
}

aria2.onerror = function (error) {
  console.error("WebSocket error:", error)
}

function requestCounts() {
  aria2.send(JSON.stringify(getActiveDownloads))
  aria2.send(JSON.stringify(getActiveSeeding))
}

function updateBadge() {
  if (activeDownloads > 0) {
    chrome.action.setBadgeText({ text: activeDownloads.toString() })
    chrome.action.setBadgeBackgroundColor({ color: [0, 0, 255, 255] }) // 蓝色
  } else if (activeSeeding > 0) {
    chrome.action.setBadgeText({ text: activeSeeding.toString() })
    chrome.action.setBadgeBackgroundColor({ color: [0, 255, 0, 255] }) // 绿色
  } else {
    chrome.action.setBadgeText({ text: '' })
  }
}
