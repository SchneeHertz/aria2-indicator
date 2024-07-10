<div align="center">

<img src="https://raw.githubusercontent.com/SchneeHertz/aria2-indicator/master/crx_file/icon/Ar.png" alt="icon.png" width="128"/>

# Aria2 Indicator
</div>

**A minimalist Aria2 download status indicator (Chrome extension) that can only display or cancel the current task, without requiring any permissions, and has no other functions.**

## Installation

<a href="https://chromewebstore.google.com/detail/aria2-indicator/dnpnmiohajiajogiadhghepaholocnlj">
  <img height="58" src="https://raw.githubusercontent.com/SchneeHertz/aria2-indicator/master/screenshot/chrome_store.png" alt="Chrome Web Store">
</a>

## Features

- Display the number of tasks currently downloading or seeding on the icon
- Show information about tasks currently downloading or seeding on the pop-up page
- Cancel download task

## Screenshot

<img src="https://raw.githubusercontent.com/SchneeHertz/aria2-indicator/master/screenshot/popup.jpg" width="512"/>

## Development

1. Clone the repository
2. Run `npm install`
3. Run `npm run dev`
4. Load the extension at `/dist` in Chrome after HMR
5. Run `npm run build` to build the extension