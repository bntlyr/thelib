// Content script for extracting manga data from web pages

// Monitor for authentication token in localStorage
function monitorAuthToken() {
  const checkAuth = () => {
    const token = localStorage.getItem('thelibExtensionToken');
    const authFlag = localStorage.getItem('thelibExtensionAuth');
    
    if (token && authFlag === 'true') {
      // Send token to extension
      chrome.runtime.sendMessage({
        action: 'authTokenReceived',
        token: token
      });
      
      // Clear the flags
      localStorage.removeItem('thelibExtensionToken');
      localStorage.removeItem('thelibExtensionAuth');
    }
  };
  
  // Check immediately
  checkAuth();
  
  // Check periodically
  setInterval(checkAuth, 1000);
}

// Start monitoring if we're on the TheLib domain
if (window.location.hostname.includes('thelib') || window.location.hostname.includes('vercel.app')) {
  monitorAuthToken();
}

class MangaExtractor {
  constructor() {
    this.siteHandlers = {
      'mangadex.org': this.extractMangaDex.bind(this),
      'mangakakalot.com': this.extractMangakakalot.bind(this),
      'manganato.com': this.extractManganato.bind(this),
      'webtoons.com': this.extractWebtoons.bind(this),
      'mangaplus.shueisha.co.jp': this.extractMangaPlus.bind(this),
      'viz.com': this.extractViz.bind(this),
      // Add more sites as needed
    };
  }

  // Generic extractor that works on most sites
  extractGeneric() {
    const data = {
      title: this.findTitle(),
      description: this.findDescription(),
      author: this.findAuthor(),
      genres: this.findGenres(),
      status: this.findStatus(),
      currentChapter: this.findCurrentChapter(),
      imgPath: this.findCoverImage(),
      source: window.location.hostname,
      url: window.location.href
    };
    
    return this.cleanData(data);
  }

  // Site-specific extractors
  extractMangaDex() {
    return {
      title: document.querySelector('.manga-title, h1')?.textContent?.trim(),
      description: document.querySelector('.manga-desc, .description')?.textContent?.trim(),
      author: document.querySelector('.manga-author, .author')?.textContent?.trim(),
      genres: Array.from(document.querySelectorAll('.genre, .tag')).map(el => el.textContent.trim()),
      status: document.querySelector('.status')?.textContent?.trim() || 'ongoing',
      currentChapter: this.extractChapterFromUrl() || '1',
      imgPath: document.querySelector('.manga-cover img, .cover img')?.src,
      source: 'MangaDex',
      url: window.location.href
    };
  }

  extractMangakakalot() {
    return {
      title: document.querySelector('.manga-info-text h1, .info-title')?.textContent?.trim(),
      description: document.querySelector('.panel-story-info-description, .description')?.textContent?.trim(),
      author: document.querySelector('.manga-info-text li:contains("Author")')?.textContent?.replace('Author :', '').trim(),
      genres: Array.from(document.querySelectorAll('.manga-info-text li a[href*="genre"]')).map(el => el.textContent.trim()),
      status: document.querySelector('.manga-info-text li:contains("Status")')?.textContent?.replace('Status :', '').trim() || 'ongoing',
      currentChapter: this.extractChapterFromUrl() || '1',
      imgPath: document.querySelector('.manga-info-pic img')?.src,
      source: 'Mangakakalot',
      url: window.location.href
    };
  }

  extractManganato() {
    return {
      title: document.querySelector('.story-info-right h1')?.textContent?.trim(),
      description: document.querySelector('.panel-story-info-description')?.textContent?.trim(),
      author: document.querySelector('.variations-tableInfo tr:contains("Author") td:last-child')?.textContent?.trim(),
      genres: Array.from(document.querySelectorAll('.variations-tableInfo tr:contains("Genres") td:last-child a')).map(el => el.textContent.trim()),
      status: document.querySelector('.variations-tableInfo tr:contains("Status") td:last-child')?.textContent?.trim() || 'ongoing',
      currentChapter: this.extractChapterFromUrl() || '1',
      imgPath: document.querySelector('.story-info-left .info-image img')?.src,
      source: 'Manganato',
      url: window.location.href
    };
  }

  extractWebtoons() {
    return {
      title: document.querySelector('.subj')?.textContent?.trim(),
      description: document.querySelector('.summary')?.textContent?.trim(),
      author: document.querySelector('.author')?.textContent?.trim(),
      genres: Array.from(document.querySelectorAll('.genre_list a')).map(el => el.textContent.trim()),
      status: 'ongoing',
      currentChapter: this.extractChapterFromUrl() || '1',
      imgPath: document.querySelector('.DetailHeader img')?.src,
      source: 'Webtoons',
      url: window.location.href
    };
  }

  extractMangaPlus() {
    return {
      title: document.querySelector('.TitleDetailHeader-module_title')?.textContent?.trim(),
      description: document.querySelector('.TitleDetailHeader-module_overview')?.textContent?.trim(),
      author: document.querySelector('.TitleDetailHeader-module_author')?.textContent?.trim(),
      genres: [],
      status: 'ongoing',
      currentChapter: this.extractChapterFromUrl() || '1',
      imgPath: document.querySelector('.TitleDetailHeader-module_imageWrapper img')?.src,
      source: 'MangaPlus',
      url: window.location.href
    };
  }

  extractViz() {
    return {
      title: document.querySelector('.product-title, h1')?.textContent?.trim(),
      description: document.querySelector('.product-description, .synopsis')?.textContent?.trim(),
      author: document.querySelector('.product-creator, .author')?.textContent?.trim(),
      genres: [],
      status: 'ongoing',
      currentChapter: this.extractChapterFromUrl() || '1',
      imgPath: document.querySelector('.product-image img, .cover img')?.src,
      source: 'VIZ',
      url: window.location.href
    };
  }

  // Helper methods
  findTitle() {
    const selectors = [
      'h1', '.title', '.manga-title', '.series-title', 
      '.comic-title', '.story-title', '[class*="title"]'
    ];
    
    for (const selector of selectors) {
      const element = document.querySelector(selector);
      if (element && element.textContent.trim()) {
        return element.textContent.trim();
      }
    }
    
    return document.title.split(' - ')[0] || 'Unknown Title';
  }

  findDescription() {
    const selectors = [
      '.description', '.synopsis', '.summary', '.overview',
      '.manga-desc', '.story-desc', '[class*="description"]'
    ];
    
    for (const selector of selectors) {
      const element = document.querySelector(selector);
      if (element && element.textContent.trim()) {
        return element.textContent.trim();
      }
    }
    
    return '';
  }

  findAuthor() {
    const selectors = [
      '.author', '.creator', '.manga-author', '.artist',
      '[class*="author"]', '[class*="creator"]'
    ];
    
    for (const selector of selectors) {
      const element = document.querySelector(selector);
      if (element && element.textContent.trim()) {
        return element.textContent.trim();
      }
    }
    
    return '';
  }

  findGenres() {
    const selectors = [
      '.genre', '.tag', '.category', '.genres a',
      '[class*="genre"]', '[class*="tag"]'
    ];
    
    const genres = [];
    for (const selector of selectors) {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        const text = el.textContent.trim();
        if (text && !genres.includes(text)) {
          genres.push(text);
        }
      });
    }
    
    return genres;
  }

  findStatus() {
    const selectors = [
      '.status', '.publication-status', '[class*="status"]'
    ];
    
    for (const selector of selectors) {
      const element = document.querySelector(selector);
      if (element && element.textContent.trim()) {
        return element.textContent.trim().toLowerCase();
      }
    }
    
    return 'ongoing';
  }

  findCurrentChapter() {
    return this.extractChapterFromUrl() || '1';
  }

  findCoverImage() {
    const selectors = [
      '.cover img', '.manga-cover img', '.poster img',
      '.thumbnail img', '[class*="cover"] img', '[class*="poster"] img'
    ];
    
    for (const selector of selectors) {
      const element = document.querySelector(selector);
      if (element && element.src) {
        return element.src;
      }
    }
    
    // Try to find any large image
    const images = document.querySelectorAll('img');
    for (const img of images) {
      if (img.naturalWidth > 200 && img.naturalHeight > 200) {
        return img.src;
      }
    }
    
    return '';
  }

  extractChapterFromUrl() {
    const url = window.location.href;
    const chapterMatch = url.match(/chapter[_-]?(\d+(?:\.\d+)?)/i) || 
                        url.match(/ch[_-]?(\d+(?:\.\d+)?)/i) ||
                        url.match(/ep[_-]?(\d+(?:\.\d+)?)/i) ||
                        url.match(/episode[_-]?(\d+(?:\.\d+)?)/i);
    
    return chapterMatch ? chapterMatch[1] : null;
  }

  cleanData(data) {
    // Clean and validate the extracted data
    const cleaned = {};
    
    cleaned.title = data.title || 'Unknown Title';
    cleaned.description = data.description || '';
    cleaned.author = data.author || '';
    cleaned.genres = Array.isArray(data.genres) ? data.genres.filter(g => g && g.length > 0) : [];
    cleaned.status = data.status || 'ongoing';
    cleaned.currentChapter = data.currentChapter || '1';
    cleaned.imgPath = data.imgPath || '';
    cleaned.source = data.source || window.location.hostname;
    cleaned.url = data.url || window.location.href;
    cleaned.rating = 0; // Default rating
    
    return cleaned;
  }

  extract() {
    const hostname = window.location.hostname;
    
    // Try site-specific extractor first
    for (const [site, handler] of Object.entries(this.siteHandlers)) {
      if (hostname.includes(site)) {
        const data = handler();
        return this.cleanData(data);
      }
    }
    
    // Fall back to generic extractor
    return this.extractGeneric();
  }
}

// Initialize extractor
const extractor = new MangaExtractor();

// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "extractPageData") {
    const mangaData = extractor.extract();
    
    // Show floating button for confirmation
    showAddToLibraryButton(mangaData);
    
    sendResponse({ success: true, data: mangaData });
  }
});

// Create floating button
function showAddToLibraryButton(mangaData) {
  // Remove existing button if any
  const existingButton = document.getElementById('thelib-floating-button');
  if (existingButton) {
    existingButton.remove();
  }

  // Create floating button
  const button = document.createElement('div');
  button.id = 'thelib-floating-button';
  button.innerHTML = `
    <div class="thelib-button-content">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H18a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-5L9 5a2 2 0 0 0-2 2v1H6.5A2.5 2.5 0 0 0 4 10.5v9Z" fill="currentColor"/>
      </svg>
      <span>Add to TheLib</span>
    </div>
  `;
  
  button.addEventListener('click', () => {
    chrome.runtime.sendMessage({
      action: 'addToTheLib',
      data: mangaData
    });
    button.remove();
  });

  document.body.appendChild(button);

  // Auto-hide after 10 seconds
  setTimeout(() => {
    if (button.parentNode) {
      button.remove();
    }
  }, 10000);
}
