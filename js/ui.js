/**
 * UI Components Module
 * ====================
 * Contains functions for rendering UI components and handling user interactions.
 */

/**
 * Initializes the scrambling text effect for specified elements
 * @param {Array<string>} selectors - Array of CSS selectors for elements to apply scrambling effect
 */
function initializeScramblingEffect(selectors) {
  // Define characters to use for scrambling
  const scrambleChars = '!<>-_\\/[]{}—=+*^?#_';

  // Apply scrambling effect to all matching elements
  document.querySelectorAll(selectors.join(', ')).forEach(element => {
    // Skip if already processed
    if (element.dataset.scrambleApplied) return;
    
    element.dataset.scrambleApplied = 'true';
    
    // Store original text
    const originalText = element.dataset.originalText || element.textContent;
    element.dataset.originalText = originalText;
    
    let intervalId = null;

    // Scramble function
    const scrambleText = () => {
      let charIndex = 0;
      clearInterval(intervalId);
      
      intervalId = setInterval(() => {
        element.innerText = originalText.split('').map((char, idx) => {
          if (idx < charIndex) {
            return originalText[idx];
          } else if (/\s/.test(char)) {
            return char;
          } else {
            return scrambleChars[Math.floor(Math.random() * 19)];
          }
        }).join('');
        
        charIndex += 0.5;
        
        if (charIndex >= originalText.length) {
          clearInterval(intervalId);
          element.innerText = originalText;
        }
      }, 30);
    };

    // Add event listeners
    element.addEventListener('mouseenter', scrambleText);
    element.addEventListener('click', scrambleText);
    element.addEventListener('mouseleave', () => {
      clearInterval(intervalId);
      element.innerText = originalText;
    });
  });
}

/**
 * Creates and renders the links section UI
 * @param {Object} config - Application configuration object
 * @param {Object} state - Current application state
 * @param {Function} renderLinks - Function to render links based on filters
 */
function renderLinksSection(config, state, renderLinks) {
  const linksSection = document.getElementById('linksSection');
  
  linksSection.innerHTML = `
    <div class="flex flex-col items-center mb-8 animate-card">
      <div class="relative w-full max-w-md">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <i class="bi bi-search text-[color:var(--ui-fg-muted)]"></i>
        </div>
        <input 
          id="searchInput" 
          type="text" 
          class="block w-full pl-10 pr-10 py-2 border border-[color:var(--ui-border-base)] rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-black" 
          placeholder="Search links...">
        <div id="searchClear" class="absolute inset-y-0 right-0 pr-3 flex items-center hidden cursor-pointer">
          <i class="bi bi-x-lg text-gray-400 hover:text-black"></i>
        </div>
      </div>
      <div id="categoryFilter" class="flex flex-wrap justify-center gap-2 mt-4 w-full max-w-2xl"></div>
    </div>
    <div id="linksGrid" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4"></div>
    <div id="noResults" class="hidden text-center py-10">
      <i class="bi bi-emoji-frown text-4xl text-[color:var(--ui-fg-muted)] mb-4"></i>
      <h3 class="text-xl font-medium">No links found</h3>
      <p class="text-[color:var(--ui-fg-muted)] mt-2">Try a different search term or category</p>
    </div>
  `;
  
  // Initialize category filtering
  initializeCategoryFilter(config, state, renderLinks);
  
  // Render initial links
  renderLinks(filterLinks(config.links, state));
}

/**
 * Initializes search functionality
 * @param {Object} config - Application configuration object
 * @param {Object} state - Current application state
 * @param {Function} renderLinks - Function to render links based on filters
 */
function initializeSearch(config, state, renderLinks) {
  const searchInput = document.getElementById('searchInput');
  const searchClear = document.getElementById('searchClear');

  searchInput.addEventListener('input', (event) => {
    state.searchQuery = event.target.value.trim();
    searchClear.classList.toggle('hidden', !state.searchQuery);
    renderLinks(filterLinks(config.links, state));
  });

  searchClear.addEventListener('click', () => {
    searchInput.value = '';
    state.searchQuery = '';
    searchClear.classList.add('hidden');
    renderLinks(filterLinks(config.links, state));
  });
}

/**
 * Initializes category filtering
 * @param {Object} config - Application configuration object
 * @param {Object} state - Current application state
 * @param {Function} renderLinks - Function to render links based on filters
 */
function initializeCategoryFilter(config, state, renderLinks) {
  const categoryFilter = document.getElementById('categoryFilter');
  
  // Get all unique categories
  const categories = ['all', ...new Set(config.links.map(link => link.category))];
  
  categoryFilter.innerHTML = '';
  
  categories.forEach((category, index) => {
    const button = document.createElement('button');
    const isActive = state.activeCategory === category;
    
    button.className = `px-3 py-1 rounded-full text-sm font-medium transition-colors border animate-card ${isActive ? 'bg-black text-white border-black' : 'bg-white text-black border-gray-300 hover:bg-gray-100'}`;
    button.textContent = category === 'all' ? 'All' : (config.categoryNames[category] || category);
    button.style.setProperty('--animation-delay', `${50 * index}ms`);
    
    button.addEventListener('click', () => {
      state.activeCategory = category;
      initializeCategoryFilter(config, state, renderLinks); // Re-render buttons
      renderLinks(filterLinks(config.links, state));
      setTimeout(() => initializeScramblingEffect(['#categoryFilter button']), 50);
    });
    
    categoryFilter.appendChild(button);
  });
}

/**
 * Filters links based on active category and search query
 * @param {Array} links - Array of link objects to filter
 * @param {Object} state - Current application state
 * @returns {Array} Filtered array of link objects
 */
function filterLinks(links, state) {
  return links.filter(link => {
    const matchesCategory = state.activeCategory === 'all' || link.category === state.activeCategory;
    const matchesSearch = !state.searchQuery || 
      link.platform.toLowerCase().includes(state.searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });
}

/**
 * Renders links in the grid
 * @param {Array} filteredLinks - Array of links to render
 */
function renderLinks(filteredLinks) {
  const linksGrid = document.getElementById('linksGrid');
  const noResults = document.getElementById('noResults');
  
  linksGrid.innerHTML = '';
  noResults.classList.toggle('hidden', filteredLinks.length > 0);
  
  filteredLinks.forEach((link, index) => {
    // Determine icon based on platform
    const platformKey = link.platform.toLowerCase().replace(/[^a-z0-9]/g, '');
    const iconClass = link.iconMap[platformKey] || link.iconMap.default;
    
    const linkElement = document.createElement('a');
    linkElement.href = link.url;
    linkElement.target = '_blank';
    linkElement.rel = 'noopener noreferrer';
    linkElement.className = 'group animate-card flex items-center justify-between p-4 bg-white border border-[color:var(--ui-border-base)] rounded-lg shadow-sm hover:shadow-lg hover:border-black hover:-translate-y-1 active:scale-[0.98] transition-all duration-300 ease-in-out';
    linkElement.style.setProperty('--animation-delay', `${30 * index}ms`);
    
    // Highlight search terms if present
    const platformDisplay = state.searchQuery 
      ? link.platform.replace(
          new RegExp(`(${state.searchQuery.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi'), 
          '<span class="search-highlight">$1</span>'
        ) 
      : link.platform;
    
    linkElement.innerHTML = `
      <div class="flex items-center">
        <i class="bi ${iconClass} text-xl text-[color:var(--ui-fg-muted)] transition-colors group-hover:text-black"></i>
        <span class="ml-4 font-medium text-[color:var(--ui-fg-muted)] transition-colors group-hover:text-black">${platformDisplay}</span>
      </div>
      <i class="bi-arrow-up-right text-lg text-[color:var(--ui-fg-muted)] group-hover:text-black transition-colors"></i>
    `;
    
    linksGrid.appendChild(linkElement);
  });
}

/**
 * Renders the portfolio section
 * @param {Object} config - Application configuration object
 */
function renderPortfolioSection(config) {
  const portfolioSection = document.getElementById('portfolioSection');
  
  portfolioSection.innerHTML = '<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"></div>';
  const container = portfolioSection.firstChild;
  
  config.portfolio.forEach((item, index) => {
    const portfolioCard = document.createElement('div');
    portfolioCard.className = 'animate-card bg-white border border-[color:var(--ui-border-base)] rounded-lg shadow-sm overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-black hover:-translate-y-1';
    portfolioCard.style.setProperty('--animation-delay', `${100 * index}ms`);
    
    portfolioCard.innerHTML = `
      <div class="overflow-hidden">
        <img data-src="${item.image}" alt="${item.title}" class="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105 lazy">
      </div>
      <div class="p-5">
        <h3 class="text-lg font-semibold">${item.title}</h3>
        <p class="text-sm text-[color:var(--ui-fg-muted)] mt-1">${item.description}</p>
        <div class="mt-4 flex space-x-4">
          <a href="${item.liveUrl}" target="_blank" class="text-sm font-medium hover:underline">Live Demo <i class="bi bi-arrow-up-right ml-1"></i></a>
          <a href="${item.detailsUrl}" target="_blank" class="text-sm font-medium hover:underline">Details</a>
        </div>
      </div>
    `;
    
    container.appendChild(portfolioCard);
  });
}

/**
 * Renders the experience section
 * @param {Object} config - Application configuration object
 */
function renderExperienceSection(config) {
  const experienceSection = document.getElementById('experienceSection');
  
  experienceSection.innerHTML = '<div class="max-w-3xl mx-auto"><div class="space-y-8"></div></div>';
  const container = experienceSection.querySelector('.space-y-8');
  
  config.experience.forEach((exp, index) => {
    const dutiesList = exp.duties.map(duty => `<li>${duty}</li>`).join('');
    
    const expElement = document.createElement('div');
    expElement.className = 'animate-card flex';
    expElement.style.setProperty('--animation-delay', `${100 * index}ms`);
    
    expElement.innerHTML = `
      <div class="flex flex-col items-center mr-4">
        <div>
          <div class="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full text-black text-base">
            <i class="bi ${exp.icon}"></i>
          </div>
        </div>
        <div class="w-px h-full bg-[color:var(--ui-border-base)]"></div>
      </div>
      <div class="pb-8">
        <p class="mb-1 text-sm text-[color:var(--ui-fg-muted)]">${exp.date}</p>
        <h3 class="font-semibold">${exp.title}</h3>
        <p class="text-sm text-[color:var(--ui-fg-muted)]">${exp.company}</p>
        <ul class="mt-2 ml-4 list-disc text-sm text-[color:var(--ui-fg-muted)] space-y-1">${dutiesList}</ul>
      </div>
    `;
    
    container.appendChild(expElement);
  });
}

/**
 * Renders the projects section
 * @param {Object} config - Application configuration object
 */
function renderProjectsSection(config) {
  const projectsSection = document.getElementById('projectsSection');
  
  projectsSection.innerHTML = '<div class="grid grid-cols-1 md:grid-cols-2 gap-6"></div>';
  const container = projectsSection.firstChild;
  
  config.projects.forEach((project, index) => {
    const tagsHtml = project.tags.map(tag => 
      `<span class="flex items-center text-xs font-medium bg-gray-100 text-gray-800 px-2.5 py-1 rounded-full">
        <i class="bi ${tag.icon} mr-1.5"></i> ${tag.name}
      </span>`
    ).join('');
    
    const projectCard = document.createElement('div');
    projectCard.className = 'animate-card bg-white border border-[color:var(--ui-border-base)] rounded-lg shadow-sm p-5 flex flex-col transition-all duration-300 hover:shadow-xl hover:border-black hover:-translate-y-1';
    projectCard.style.setProperty('--animation-delay', `${100 * index}ms`);
    
    projectCard.innerHTML = `
      <h3 class="text-lg font-semibold">${project.title}</h3>
      <p class="text-sm text-[color:var(--ui-fg-muted)] mt-1 flex-grow">${project.description}</p>
      <div class="mt-4 flex flex-wrap gap-2">${tagsHtml}</div>
      <div class="mt-4 pt-4 border-t border-[color:var(--ui-border-base)] flex space-x-4">
        <a href="${project.sourceUrl}" target="_blank" class="text-sm font-medium hover:underline inline-flex items-center">
          <i class="bi bi-github mr-1.5"></i>View Source
        </a>
        <a href="${project.liveUrl}" target="_blank" class="text-sm font-medium hover:underline inline-flex items-center">
          <i class="bi bi-arrow-up-right mr-1.5"></i>Live Demo
        </a>
      </div>
    `;
    
    container.appendChild(projectCard);
  });
}

/**
 * Renders the contact section
 * @param {Object} config - Application configuration object
 */
function renderContactSection(config) {
  const contactSection = document.getElementById('contactSection');
  
  contactSection.innerHTML = `
    <div class="animate-card max-w-2xl mx-auto bg-white border border-[color:var(--ui-border-base)] rounded-lg shadow-sm p-6 sm:p-8">
      <h2 class="text-xl font-semibold text-center">Get In Touch</h2>
      <p class="text-sm text-[color:var(--ui-fg-muted)] text-center mt-2">Have a question or want to work together? Send me a message!</p>
      <form id="contactForm" class="mt-6 space-y-4">
        <div>
          <label for="name" class="block text-sm font-medium text-[color:var(--ui-fg-muted)]">Name</label>
          <input type="text" id="name" name="name" class="mt-1 block w-full px-3 py-2 bg-white border border-[color:var(--ui-border-base)] rounded-md shadow-sm focus:outline-none focus:ring-black" required>
        </div>
        <div>
          <label for="email" class="block text-sm font-medium text-[color:var(--ui-fg-muted)]">Email</label>
          <input type="email" id="email" name="email" class="mt-1 block w-full px-3 py-2 bg-white border border-[color:var(--ui-border-base)] rounded-md shadow-sm focus:outline-none focus:ring-black" required>
        </div>
        <div>
          <label for="message" class="block text-sm font-medium text-[color:var(--ui-fg-muted)]">Message</label>
          <textarea id="message" name="message" rows="4" class="mt-1 block w-full px-3 py-2 bg-white border border-[color:var(--ui-border-base)] rounded-md shadow-sm focus:outline-none focus:ring-black" required></textarea>
        </div>
        <div>
          <button type="submit" id="submitBtn" class="w-full inline-flex justify-center py-2.5 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-black hover:bg-white hover:text-black hover:border-black transition-colors duration-300">Send Message</button>
        </div>
        <p id="formStatus" class="text-center text-sm mt-2"></p>
      </form>
    </div>
  `;
  
  // Add form submission handler
  document.getElementById('contactForm').addEventListener('submit', (event) => {
    handleSubmit(event, config);
  });
}

/**
 * Validates form inputs
 * @param {FormData} formData - Form data to validate
 * @returns {Array<string>} Array of error messages, empty if valid
 */
function validateForm(formData) {
  const errors = [];
  
  const name = formData.get('name');
  const email = formData.get('email');
  const message = formData.get('message');
  
  // Validate name
  if (!name || name.trim().length === 0) {
    errors.push('Name is required');
  } else if (name.trim().length < 2) {
    errors.push('Name must be at least 2 characters');
  }
  
  // Validate email
  if (!email || email.trim().length === 0) {
    errors.push('Email is required');
  } else {
    const emailRegex = /^[\w\.-]+@[\w\.-]+\.\w+$/;
    if (!emailRegex.test(email)) {
      errors.push('Please enter a valid email address');
    }
  }
  
  // Validate message
  if (!message || message.trim().length === 0) {
    errors.push('Message is required');
  } else if (message.trim().length < 5) {
    errors.push('Message must be at least 5 characters');
  }
  
  return errors;
}

/**
 * Sanitizes user input to prevent XSS
 * @param {string} input - Input string to sanitize
 * @returns {string} Sanitized string
 */
function sanitizeInput(input) {
  if (typeof input !== 'string') {
    return '';
  }
  
  // Remove potentially harmful characters
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Handles form submission
 * @param {Event} event - Form submit event
 * @param {Object} config - Application configuration object
 */
async function handleSubmit(event, config) {
  event.preventDefault();
  
  const form = event.target;
  const submitButton = form.querySelector('#submitBtn');
  const statusElement = form.querySelector('#formStatus');
  
  const { name, email, message } = form.elements;
  
  // Create FormData object for validation
  const formData = new FormData(form);
  
  // Validate form inputs
  const errors = validateForm(formData);
  
  if (errors.length > 0) {
    statusElement.innerHTML = `<strong>Please fix the following errors:</strong><br>${errors.join('<br>')}`;
    statusElement.style.color = 'red';
    return;
  }
  
  // Sanitize inputs
  const sanitizedName = sanitizeInput(name.value);
  const sanitizedEmail = sanitizeInput(email.value);
  const sanitizedMessage = sanitizeInput(message.value);
  
  // Disable button and show loading state
  submitButton.disabled = true;
  submitButton.textContent = 'Sending...';
  statusElement.textContent = '';
  
  // Prepare message for Telegram
  const telegramMessage = `New Message from Portfolio

*Name:* ${sanitizedName}
*Email:* ${sanitizedEmail}

*Message:*
${sanitizedMessage}`;
  const telegramApiUrl = `https://api.telegram.org/bot${config.telegram.botToken}/sendMessage`;
  
  try {
    const response = await fetch(telegramApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        chat_id: config.telegram.chatId,
        text: telegramMessage,
        parse_mode: 'Markdown'
      })
    });
    
    const result = await response.json();
    
    if (!result.ok) {
      throw new Error(result.description);
    }
    
    // Success message
    statusElement.textContent = 'Message sent successfully!';
    statusElement.style.color = 'green';
    form.reset();
  } catch (error) {
    console.error('Error sending message:', error);
    
    // More descriptive error message
    if (error.message.includes('404') || error.message.includes('401')) {
      statusElement.innerHTML = 'Configuration error: Please check your Telegram bot token and chat ID in config/telegram.json';
    } else {
      statusElement.textContent = 'Failed to send message. Please try again later.';
    }
    statusElement.style.color = 'red';
  } finally {
    // Re-enable button
    submitButton.disabled = false;
    submitButton.textContent = 'Send Message';
    initializeScramblingEffect(['#submitBtn']);
  }
}

export { 
  initializeScramblingEffect, 
  renderLinksSection, 
  renderPortfolioSection, 
  renderExperienceSection, 
  renderProjectsSection, 
  renderContactSection 
};