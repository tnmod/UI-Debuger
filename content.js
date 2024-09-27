let styleElement = null;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "toggleCSS") {
    if (request.isActive) {
      addCSS();
    } else {
      removeCSS();
    }
  }
});

function addCSS() {
  if (!styleElement) {
    styleElement = document.createElement('style');
    styleElement.type = 'text/css';
    document.head.appendChild(styleElement);
  }
  styleElement.textContent = `
    div { outline: 1px solid rgba(217, 78, 78, 0.49); }
    section { outline: 1px solid rgba(0, 0, 255, 0.65); }
    header { outline: 1px solid rgba(0, 128, 0, 0.68); }
    footer { outline: 1px solid rgba(43, 0, 128, 0.78); }
    article { outline: 1px solid rgba(255, 165, 0, 0.66); }
    nav { outline: 1px solid rgba(165, 42, 42, 0.66); }
    span { outline: 1px solid rgba(255, 192, 203, 0.66); }
    a { outline: 1px solid rgba(255, 255, 0, 0.62); }
    p { outline: 1px solid rgba(0, 128, 128, 0.71); }
    img { outline: 1px solid rgba(238, 130, 238, 0.73); }
    h1, h2, h3, h4, h5, h6 { outline: 1px solid rgba(0, 255, 255, 0.65); }
  `;
}

function removeCSS() {
  if (styleElement) {
    styleElement.textContent = '';
  }
}