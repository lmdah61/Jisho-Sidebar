// Allows users to open the side panel by clicking on the action toolbar icon
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error('Error setting panel behavior:', error));

chrome.runtime.onInstalled.addListener(() => {
  // Create context menu for opening the sidebar
  chrome.contextMenus.create({
    id: 'openSidePanel',
    title: 'Open Jisho Sidebar',
    contexts: ['all']
  });
  
  // Create context menu for looking up selected text
  chrome.contextMenus.create({
    id: 'lookupSelectedText',
    title: 'Look up "%s" in Jisho',
    contexts: ['selection']
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'openSidePanel') {
    // This will open the panel in all the pages on the current window.
    chrome.sidePanel.open({ windowId: tab.windowId })
      .catch(error => console.error('Error opening side panel:', error));
  } else if (info.menuItemId === 'lookupSelectedText' && info.selectionText) {
    // First ensure the panel is open
    chrome.sidePanel.open({ windowId: tab.windowId })
      .then(() => {
        // Then send the selected text to the panel
        chrome.runtime.sendMessage({
          action: 'lookupText',
          text: info.selectionText
        }).catch(error => console.error('Error sending message:', error));
      })
      .catch(error => console.error('Error opening side panel for lookup:', error));
  }
});

// Add keyboard shortcut handler
chrome.commands.onCommand.addListener((command) => {
  if (command === 'open_jisho_sidebar') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.sidePanel.open({ windowId: tabs[0].windowId })
          .catch(error => console.error('Error opening side panel with shortcut:', error));
      }
    });
  }
});