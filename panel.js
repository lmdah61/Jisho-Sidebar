// panel.js - Handles the functionality of the Jisho sidebar panel

document.addEventListener('DOMContentLoaded', function() {
    const jishoFrame = document.getElementById('jishoFrame');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const errorMessage = document.getElementById('errorMessage');
    
    // Show loading indicator when iframe starts loading
    showLoading();
    
    // Handle iframe loading events
    jishoFrame.addEventListener('load', function() {
        hideLoading();
        hideError();
    });
    
    jishoFrame.addEventListener('error', function() {
        hideLoading();
        showError('Failed to load Jisho. Please check your internet connection and try again.');
    });
    
    // Listen for messages from the background script
    chrome.runtime.onMessage.addListener(function(message) {
        if (message.action === 'lookupText' && message.text) {
            lookupText(message.text);
        }
    });
    
    // Function to look up selected text
    function lookupText(text) {
        if (text && text.trim() !== '') {
            const encodedText = encodeURIComponent(text.trim());
            jishoFrame.src = `https://jisho.org/search/${encodedText}`;
            showLoading();
        }
    }
    
    // Helper functions for UI state management
    function showLoading() {
        if (loadingIndicator) {
            loadingIndicator.style.display = 'flex';
        }
    }
    
    function hideLoading() {
        if (loadingIndicator) {
            loadingIndicator.style.display = 'none';
        }
    }
    
    function showError(message) {
        if (errorMessage) {
            errorMessage.textContent = message;
            errorMessage.style.display = 'block';
        }
    }
    
    function hideError() {
        if (errorMessage) {
            errorMessage.style.display = 'none';
        }
    }
});