const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
console.log(tab)

chrome.scripting.executeScript(
  {
    target: { tabId: tab.id! },
    world: 'MAIN',
    injectImmediately: true,
    func: () => {
      window.getReactInstance = (css) => {
        const reactRoot = document.querySelector(css)
        if (!reactRoot) {
          return null
        }

        return reactRoot[Object.keys(reactRoot).find(key => key.startsWith('__react'))]
      }
    },

  },
  (result) => {
    console.log('injection result :', result)
  },
)
