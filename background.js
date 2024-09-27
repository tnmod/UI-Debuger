let isActive = false;

chrome.action.onClicked.addListener((tab) => {
  isActive = !isActive;
  chrome.tabs.sendMessage(tab.id, { action: "toggleCSS", isActive });
});
