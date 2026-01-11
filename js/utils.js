/**
 * Utility Functions Module
 * ========================
 * Contains reusable utility functions for the portfolio website.
 */

/**
 * Validates the loaded configuration data
 * @param {Object} config - Configuration object to validate
 * @returns {boolean} True if valid, throws error if invalid
 */
function validateConfig(config) {
  // Validate required properties exist
  const requiredProperties = ['telegram', 'links', 'portfolio', 'experience', 'projects', 'navigation', 'iconMap', 'categoryNames'];
  
  for (const prop of requiredProperties) {
    if (!(prop in config)) {
      throw new Error(`Missing required configuration property: ${prop}`);
    }
  }
  
  // Validate telegram configuration
  if (!config.telegram || typeof config.telegram !== 'object') {
    throw new Error('Invalid telegram configuration');
  }
  
  if (!config.telegram.botToken || !config.telegram.chatId) {
    console.warn('Telegram bot token or chat ID not configured. Contact form may not work properly.');
  }
  
  // Validate arrays
  const arrayProps = ['links', 'portfolio', 'experience', 'projects', 'navigation'];
  for (const prop of arrayProps) {
    if (!Array.isArray(config[prop])) {
      throw new Error(`Configuration property ${prop} must be an array`);
    }
  }
  
  // Validate links
  for (const [index, link] of config.links.entries()) {
    if (!link.platform || !link.url || !link.category) {
      throw new Error(`Invalid link at index ${index}: missing platform, url, or category`);
    }
    
    try {
      new URL(link.url); // Validate URL format
    } catch (urlError) {
      throw new Error(`Invalid URL at index ${index}: ${link.url}`);
    }
  }
  
  // Validate navigation
  for (const [index, navItem] of config.navigation.entries()) {
    if (!navItem.id || !navItem.name || !navItem.icon || !navItem.activeIcon) {
      throw new Error(`Invalid navigation item at index ${index}: missing required properties`);
    }
  }
  
  return true;
}

/**
 * Loads all configuration files from the config directory
 * @returns {Promise<Object>} A promise that resolves to an object containing all configuration data
 */
async function loadConfig() {
  const configFiles = [
    'telegram.json',
    'links.json', 
    'portfolio.json', 
    'experience.json', 
    'projects.json', 
    'navigation.json', 
    'ui.json'
  ];

  try {
    // Fetch all configuration files in parallel
    const responses = await Promise.all(
      configFiles.map(fileName => fetch(`./config/${fileName}`))
    );

    // Check if any request failed
    for (const response of responses) {
      if (!response.ok) {
        throw new Error(`Failed to fetch ${response.url}: ${response.statusText}`);
      }
    }

    // Parse all JSON responses in parallel
    const [telegram, links, portfolio, experience, projects, navigation, ui] = 
      await Promise.all(responses.map(response => response.json()));

    // Create consolidated configuration object
    const config = {
      telegram,
      links,
      portfolio,
      experience,
      projects,
      navigation,
      iconMap: ui.iconMap,
      categoryNames: ui.categoryNames
    };
    
    // Validate the configuration
    validateConfig(config);
    
    // Return validated configuration object
    return config;
  } catch (error) {
    console.error('Error loading configuration:', error);
    throw error;
  }
}

/**
 * Updates the schema data with the provided links
 * @param {Array} links - Array of link objects
 */
function updateSchemaData(links) {
  const schemaElement = document.getElementById('schema-data');
  if (schemaElement) {
    const schemaData = JSON.parse(schemaElement.textContent);
    schemaData.sameAs = links.map(link => link.url);
    schemaElement.textContent = JSON.stringify(schemaData, null, 2);
  }
}

/**
 * Gets URL parameters from the current location
 * @returns {Object} Object containing URL parameters
 */
function getUrlParams() {
  const params = {};
  const urlParams = new URLSearchParams(window.location.search);
  
  for (const [key, value] of urlParams) {
    params[key] = value;
  }
  
  return params;
}

/**
 * Shows/hides the loader with optional message
 * @param {boolean} show - Whether to show or hide the loader
 * @param {string} message - Optional message to display in the loader
 */
function toggleLoader(show, message = '') {
  const loader = document.getElementById('loader');
  const loaderText = document.getElementById('loader-text');
  
  if (show) {
    loader.style.display = 'flex';
    loader.style.opacity = '1';
    if (message) {
      loaderText.textContent = message;
    }
  } else {
    loader.style.opacity = '0';
    setTimeout(() => {
      loader.style.display = 'none';
    }, 300);
  }
}

/**
 * Scrolls smoothly to the top of the page
 */
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

export { loadConfig, updateSchemaData, getUrlParams, toggleLoader, scrollToTop };