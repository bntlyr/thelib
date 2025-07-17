// Background service worker for TheLib extension
chrome.runtime.onInstalled.addListener(() => {
  // Create context menu
  chrome.contextMenus.create({
    id: "addToTheLib",
    title: "Add to TheLib",
    contexts: ["page", "selection", "image", "link"]
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "addToTheLib") {
    // Send message to content script to extract page data
    chrome.tabs.sendMessage(tab.id, {
      action: "extractPageData",
      url: info.pageUrl || tab.url,
      selectedText: info.selectionText,
      linkUrl: info.linkUrl,
      srcUrl: info.srcUrl
    });
  }
});

// Handle messages from content script and popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "authTokenReceived") {
    // Store the auth token
    chrome.storage.local.set({
      thelibAuthToken: request.token
    });
    
    // Notify popup if it's open
    chrome.runtime.sendMessage({
      action: "authTokenUpdated"
    }).catch(() => {
      // Popup might not be open, that's fine
    });
    
    sendResponse({ success: true });
    return;
  }
  
  if (request.action === "addToTheLib") {
    // Store the extracted data temporarily
    chrome.storage.local.set({
      pendingManga: request.data
    }, () => {
      // Open popup or send to TheLib app
      sendToTheLibApp(request.data);
    });
  }
  
  if (request.action === "getAuthToken") {
    // Get stored authentication token
    chrome.storage.local.get(['thelibAuthToken'], (result) => {
      sendResponse({ token: result.thelibAuthToken });
    });
    return true; // Required for async response
  }
});

// Function to send data to TheLib app
async function sendToTheLibApp(mangaData) {
  try {
    // Get stored auth token
    const result = await chrome.storage.local.get(['thelibAuthToken', 'thelibServerUrl']);
    const token = result.thelibAuthToken;
    const serverUrl = result.thelibServerUrl || 'https://thelib.vercel.app';
    
    if (!token) {
      // Open popup for authentication
      chrome.action.openPopup();
      return;
    }

    // Send to TheLib API
    const response = await fetch(`${serverUrl}/api/manga`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(mangaData)
    });

    if (response.ok) {
      // Show success notification
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon48.png',
        title: 'TheLib',
        message: `Added "${mangaData.title}" to your library!`
      });
    } else {
      throw new Error('Failed to add manga');
    }
  } catch (error) {
    console.error('Error adding to TheLib:', error);
    // Open popup for manual handling
    chrome.action.openPopup();
  }
}
