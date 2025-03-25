// panel.js - Handles the sidebar panel functionality

document.addEventListener('DOMContentLoaded', function() {
    // Get the iframe element
    const jishoFrame = document.getElementById('jishoFrame');
    
    // Listen for messages from the background script
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.action === 'lookupWord' && message.word) {
            // Construct the Jisho search URL with the selected word
            const searchUrl = `https://jisho.org/search/${encodeURIComponent(message.word)}`;
            
            // Navigate the iframe to the search URL
            jishoFrame.src = searchUrl;
            
            // Send a response back to confirm receipt
            sendResponse({success: true});
        }
    });
});