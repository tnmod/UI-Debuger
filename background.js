// All toggle / styling logic lives in popup.js.
// This service worker only takes care of clearing per-tab state when the
// tab is closed or navigated away, so chrome.storage.session does not leak.

const STATE_KEY = "tabState";

async function clearTabState(tabId) {
  const data = await chrome.storage.session.get(STATE_KEY);
  const map = data[STATE_KEY] || {};
  if (map[tabId] === undefined) return;
  delete map[tabId];
  await chrome.storage.session.set({ [STATE_KEY]: map });
}

async function clearBadge(tabId) {
  try {
    await chrome.action.setBadgeText({ tabId, text: "" });
  } catch (_) {
    /* tab gone */
  }
}

chrome.tabs.onRemoved.addListener((tabId) => {
  clearTabState(tabId);
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  // A new navigation drops the injected CSS; mirror that in our state.
  if (changeInfo.status === "loading" && changeInfo.url) {
    clearTabState(tabId);
    clearBadge(tabId);
  }
});
