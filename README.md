<div align="center">

<img src="https://raw.githubusercontent.com/SchneeHertz/aria2-indicator/master/crx_file/icon/Ar.png" alt="icon.png" width="128"/>

# Aria2 Indicator
</div>

**A minimalist Aria2 download status indicator that displays or cancels current tasks, adds links as Aria2 download tasks without any permissions, and has no other features.**

## Installation

<a href="https://chromewebstore.google.com/detail/dnpnmiohajiajogiadhghepaholocnlj">
  <img height="58" src="https://raw.githubusercontent.com/SchneeHertz/aria2-indicator/master/screenshot/chrome_store.png" alt="Chrome Web Store">
</a>

<a href="https://microsoftedge.microsoft.com/addons/detail/aria2-indicator/ajgmkgldklfomncnmbkhlkaiecldnolk">
  <img height="58" src="https://raw.githubusercontent.com/SchneeHertz/aria2-indicator/master/screenshot/edge_store.png" alt="Edge Add-ons">
</a>

## Features

- Displays the number of currently downloading or seeding tasks on the icon
- Shows information about currently downloading or seeding tasks in a popup page
- Cancels download tasks
- Adds an option to "Send to Aria2" in the right-click menu for links

> This extension cannot intercept browser download tasks. Additionally, you need to run Aria2 on your computer for it to work properly.

## Screenshot

<img src="https://raw.githubusercontent.com/SchneeHertz/aria2-indicator/master/screenshot/popup.jpg" width="512"/>

## Development

1. Clone the repository
2. Run `npm install`
3. Run `npm run dev`
4. Load the extension at `/dist` in Chrome after HMR
5. Run `npm run build` to build the extension