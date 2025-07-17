// Popup JavaScript for TheLib extension
document.addEventListener('DOMContentLoaded', async () => {
  const loginSection = document.getElementById('loginSection');
  const mainSection = document.getElementById('mainSection');
  const statusMessage = document.getElementById('statusMessage');
  const mangaForm = document.getElementById('mangaForm');
  const coverPreview = document.getElementById('coverPreview');
  const imgPathInput = document.getElementById('imgPath');

  // Check if user is authenticated
  const authCheck = await checkAuthentication();
  if (!authCheck.authenticated) {
    showLoginSection();
    return;
  }

  // Load pending manga data or extract from current tab
  await loadMangaData();

  // Event listeners
  document.getElementById('openTheLibBtn').addEventListener('click', openTheLib);
  document.getElementById('cancelBtn').addEventListener('click', () => window.close());
  document.getElementById('addBtn').addEventListener('click', addMangaToLibrary);
  imgPathInput.addEventListener('input', updateCoverPreview);

  mangaForm.addEventListener('submit', (e) => {
    e.preventDefault();
    addMangaToLibrary();
  });
});

async function checkAuthentication() {
  try {
    const result = await chrome.storage.local.get(['thelibAuthToken', 'thelibServerUrl']);
    const serverUrl = result.thelibServerUrl || 'https://thelib.vercel.app';
    
    if (!result.thelibAuthToken) {
      return { authenticated: false };
    }

    // Test the token by making a request to the API
    const response = await fetch(`${serverUrl}/api/auth/session`, {
      headers: {
        'Authorization': `Bearer ${result.thelibAuthToken}`
      }
    });

    return { authenticated: response.ok };
  } catch (error) {
    console.error('Auth check failed:', error);
    return { authenticated: false };
  }
}

function showLoginSection() {
  document.getElementById('loginSection').classList.remove('hidden');
  document.getElementById('mainSection').classList.add('hidden');
}

function openTheLib() {
  const serverUrl = document.getElementById('serverUrl').value || 'https://thelib.vercel.app';
  
  // Store server URL
  chrome.storage.local.set({ thelibServerUrl: serverUrl });
  
  // Open TheLib in new tab
  chrome.tabs.create({ url: `${serverUrl}/auth/signin` });
  
  showStatus('Please sign in to TheLib and then return to this popup.', 'loading');
  
  // Check for auth every 2 seconds
  const authCheckInterval = setInterval(async () => {
    const authCheck = await checkAuthentication();
    if (authCheck.authenticated) {
      clearInterval(authCheckInterval);
      document.getElementById('loginSection').classList.add('hidden');
      document.getElementById('mainSection').classList.remove('hidden');
      await loadMangaData();
    }
  }, 2000);
}

async function loadMangaData() {
  try {
    // First try to get pending manga data
    const result = await chrome.storage.local.get(['pendingManga']);
    if (result.pendingManga) {
      populateForm(result.pendingManga);
      // Clear pending data
      chrome.storage.local.remove(['pendingManga']);
      return;
    }

    // Otherwise, extract from current tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab) {
      chrome.tabs.sendMessage(tab.id, { action: 'extractPageData' }, (response) => {
        if (response && response.data) {
          populateForm(response.data);
        } else {
          // Fallback: use basic page info
          populateForm({
            title: tab.title.split(' - ')[0] || 'Unknown Title',
            source: new URL(tab.url).hostname,
            url: tab.url,
            currentChapter: '1',
            status: 'ongoing'
          });
        }
      });
    }
  } catch (error) {
    console.error('Error loading manga data:', error);
    showStatus('Failed to extract manga data from page.', 'error');
  }
}

function populateForm(data) {
  document.getElementById('title').value = data.title || '';
  document.getElementById('currentChapter').value = data.currentChapter || '1';
  document.getElementById('status').value = data.status || 'ongoing';
  document.getElementById('description').value = data.description || '';
  document.getElementById('author').value = data.author || '';
  document.getElementById('source').value = data.source || '';
  document.getElementById('imgPath').value = data.imgPath || '';
  
  updateCoverPreview();
}

function updateCoverPreview() {
  const imgUrl = document.getElementById('imgPath').value;
  const preview = document.getElementById('coverPreview');
  
  if (imgUrl) {
    preview.src = imgUrl;
    preview.classList.remove('hidden');
    preview.onerror = () => preview.classList.add('hidden');
  } else {
    preview.classList.add('hidden');
  }
}

async function addMangaToLibrary() {
  const addBtn = document.getElementById('addBtn');
  addBtn.disabled = true;
  addBtn.textContent = 'Adding...';

  try {
    const result = await chrome.storage.local.get(['thelibAuthToken', 'thelibServerUrl']);
    const serverUrl = result.thelibServerUrl || 'https://thelib.vercel.app';

    const formData = {
      title: document.getElementById('title').value,
      currentChapter: document.getElementById('currentChapter').value,
      status: document.getElementById('status').value,
      description: document.getElementById('description').value,
      author: document.getElementById('author').value,
      source: document.getElementById('source').value,
      imgPath: document.getElementById('imgPath').value,
      genres: [], // Could be extracted but keeping simple for now
      rating: 0
    };

    const response = await fetch(`${serverUrl}/api/manga`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${result.thelibAuthToken}`
      },
      body: JSON.stringify(formData)
    });

    if (response.ok) {
      showStatus(`Successfully added "${formData.title}" to your library!`, 'success');
      setTimeout(() => window.close(), 2000);
    } else {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to add manga');
    }
  } catch (error) {
    console.error('Error adding manga:', error);
    showStatus(`Error: ${error.message}`, 'error');
  } finally {
    addBtn.disabled = false;
    addBtn.textContent = 'Add to Library';
  }
}

function showStatus(message, type) {
  const statusEl = document.getElementById('statusMessage');
  statusEl.textContent = message;
  statusEl.className = `status ${type}`;
  statusEl.classList.remove('hidden');

  if (type === 'success') {
    setTimeout(() => {
      statusEl.classList.add('hidden');
    }, 3000);
  }
}

// Listen for auth token updates from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'authTokenUpdated') {
    // Refresh the popup
    location.reload();
  }
});
