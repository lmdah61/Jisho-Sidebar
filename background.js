// Allows users to open the side panel by clicking on the action toolbar icon
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));

// First remove any existing context menu items to prevent duplicate ID errors
chrome.contextMenus.removeAll().then(() => {
  // Create a context menu item for looking up selected text in Jisho
  chrome.contextMenus.create({
    id: "lookupInJisho",
    title: "Look up \"%s\" in Jisho.org",
    contexts: ["selection"]
  });
});

// Handle the context menu click event
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "lookupInJisho" && info.selectionText) {
    // First ensure the side panel is open
    chrome.sidePanel.open({ windowId: tab.windowId }).then(() => {
      // Then send the selected text to the panel
      chrome.runtime.sendMessage({
        action: "lookupWord",
        word: info.selectionText
      }).catch(error => {
        // If sending message fails (panel might not be ready yet), try again after a short delay
        setTimeout(() => {
          chrome.runtime.sendMessage({
            action: "lookupWord",
            word: info.selectionText
          }).catch(err => console.error("Failed to send message after retry:", err));
        }, 500);
      });
    }).catch(error => console.error("Failed to open side panel:", error));
  }
});