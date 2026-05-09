const TAG_DEFINITIONS = [
  { selector: "div", label: "div", color: "#d94e4e" },
  { selector: "section", label: "section", color: "#0000ff" },
  { selector: "header", label: "header", color: "#008000" },
  { selector: "footer", label: "footer", color: "#2b0080" },
  { selector: "article", label: "article", color: "#ffa500" },
  { selector: "nav", label: "nav", color: "#a52a2a" },
  { selector: "span", label: "span", color: "#ffc0cb" },
  { selector: "a", label: "a", color: "#ffff00" },
  { selector: "p", label: "p", color: "#008080" },
  { selector: "img", label: "img", color: "#ee82ee" },
  { selector: "h1, h2, h3, h4, h5, h6", label: "h1–h6", color: "#00ffff" },
];

const ALPHA_HEX = "a6"; // ~0.65 alpha for 8-digit hex colors
const SETTINGS_KEY = "settings";
const TAB_STATE_KEY = "tabState";
const BADGE_COLOR = "#d94e4e";

function defaultSettings() {
  const tags = {};
  for (const t of TAG_DEFINITIONS) {
    tags[t.selector] = { enabled: true, color: t.color };
  }
  return { width: 1, mode: "outline", tags };
}

async function loadSettings() {
  const data = await chrome.storage.sync.get(SETTINGS_KEY);
  const defaults = defaultSettings();
  const stored = data[SETTINGS_KEY] || {};
  return {
    width: stored.width ?? defaults.width,
    mode: stored.mode ?? defaults.mode,
    tags: { ...defaults.tags, ...(stored.tags || {}) },
  };
}

async function saveSettings(settings) {
  await chrome.storage.sync.set({ [SETTINGS_KEY]: settings });
}

async function readTabStateMap() {
  const data = await chrome.storage.session.get(TAB_STATE_KEY);
  return data[TAB_STATE_KEY] || {};
}

async function writeTabState(tabId, state) {
  const map = await readTabStateMap();
  if (state) map[tabId] = state;
  else delete map[tabId];
  await chrome.storage.session.set({ [TAB_STATE_KEY]: map });
}

function buildCss(settings) {
  const lines = [];
  for (const t of TAG_DEFINITIONS) {
    const cfg = settings.tags[t.selector];
    if (!cfg || !cfg.enabled) continue;
    const color = `${cfg.color}${ALPHA_HEX}`;
    lines.push(
      `${t.selector} { ${settings.mode}: ${settings.width}px solid ${color} !important; }`
    );
  }
  return lines.join("\n");
}

async function getActiveTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
}

async function updateBadge(tabId, isActive) {
  try {
    await chrome.action.setBadgeBackgroundColor({ tabId, color: BADGE_COLOR });
    await chrome.action.setBadgeText({ tabId, text: isActive ? "ON" : "" });
  } catch (_) {
    /* tab gone */
  }
}

async function applyToTab(tab, settings, makeActive) {
  if (!tab || typeof tab.id !== "number") return;
  const target = { tabId: tab.id };
  const map = await readTabStateMap();
  const previous = map[tab.id];

  if (previous && previous.css) {
    try {
      await chrome.scripting.removeCSS({ target, css: previous.css });
    } catch (_) {
      /* already gone */
    }
  }

  if (makeActive) {
    const css = buildCss(settings);
    if (css) {
      try {
        await chrome.scripting.insertCSS({ target, css });
      } catch (err) {
        console.error("CSS Outliner: insertCSS failed", err);
        await writeTabState(tab.id, null);
        await updateBadge(tab.id, false);
        return;
      }
    }
    await writeTabState(tab.id, { css });
    await updateBadge(tab.id, true);
  } else {
    await writeTabState(tab.id, null);
    await updateBadge(tab.id, false);
  }
}

function renderTags(settings, onChange) {
  const list = document.getElementById("tags-list");
  list.textContent = "";
  for (const t of TAG_DEFINITIONS) {
    const cfg = settings.tags[t.selector];
    const row = document.createElement("label");
    row.className = "tag-row";
    row.title = t.selector;

    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.checked = cfg.enabled;
    cb.addEventListener("change", () => {
      settings.tags[t.selector].enabled = cb.checked;
      onChange();
    });

    const swatch = document.createElement("input");
    swatch.type = "color";
    swatch.value = cfg.color;
    swatch.addEventListener("input", () => {
      settings.tags[t.selector].color = swatch.value;
      onChange();
    });

    const name = document.createElement("span");
    name.className = "tag-label";
    name.textContent = t.label;

    row.append(cb, swatch, name);
    list.appendChild(row);
  }
}

async function init() {
  const settings = await loadSettings();
  const tab = await getActiveTab();
  const stateMap = await readTabStateMap();
  let isActive = !!(tab && stateMap[tab.id]);

  const masterToggle = document.getElementById("master-toggle");
  const widthInput = document.getElementById("width-input");
  const widthValue = document.getElementById("width-value");
  const modeInput = document.getElementById("mode-input");
  const resetButton = document.getElementById("reset-button");

  function syncControlValues() {
    masterToggle.checked = isActive;
    widthInput.value = String(settings.width);
    widthValue.textContent = `${settings.width}px`;
    modeInput.value = settings.mode;
  }

  async function persistAndReapply() {
    await saveSettings(settings);
    if (isActive) await applyToTab(tab, settings, true);
  }

  renderTags(settings, persistAndReapply);
  syncControlValues();

  masterToggle.addEventListener("change", async () => {
    isActive = masterToggle.checked;
    await applyToTab(tab, settings, isActive);
  });

  widthInput.addEventListener("input", () => {
    settings.width = Number(widthInput.value);
    widthValue.textContent = `${settings.width}px`;
    persistAndReapply();
  });

  modeInput.addEventListener("change", () => {
    settings.mode = modeInput.value;
    persistAndReapply();
  });

  resetButton.addEventListener("click", async () => {
    const fresh = defaultSettings();
    Object.assign(settings, fresh);
    settings.tags = fresh.tags;
    await saveSettings(settings);
    renderTags(settings, persistAndReapply);
    syncControlValues();
    if (isActive) await applyToTab(tab, settings, true);
  });
}

document.addEventListener("DOMContentLoaded", init);
