/**
 * Portfolio Application Module
 * ============================
 * Main application logic that orchestrates the portfolio website functionality.
 */

// Import required modules
import { loadConfig, updateSchemaData, getUrlParams, toggleLoader, scrollToTop } from './utils.js';
import { 
  initializeScramblingEffect, 
  renderLinksSection, 
  renderPortfolioSection, 
  renderExperienceSection, 
  renderProjectsSection, 
  renderContactSection 
} from './ui.js';

/**
 * Main application class
 */
class PortfolioApp {
  /**
   * Creates a new instance of the portfolio application
   */
  constructor() {
    // DOM elements cache
    this.elements = {
      navContainer: document.getElementById('nav-container'),
      contentSections: document.querySelectorAll('.content-section'),
      linksSection: document.getElementById('linksSection'),
      portfolioSection: document.getElementById('portfolioSection'),
      experienceSection: document.getElementById('experienceSection'),
      projectsSection: document.getElementById('projectsSection'),
      contactSection: document.getElementById('contactSection')
    };
    
    // Application state
    this.state = {
      activeSection: 'linksSection',
      searchQuery: '',
      activeCategory: 'all'
    };
    
    // Configuration data
    this.config = null;
  }
  
  /**
   * Initializes the application
   */
  async init() {
    try {
      // Show loader while loading configuration
      toggleLoader(true, 'Loading assets...');
      
      // Load configuration
      this.config = await loadConfig();
      
      // Update schema data with links
      updateSchemaData(this.config.links);
      
      // Check for redirect parameter in URL
      if (this.handleRedirect()) {
        return; // Exit if redirect is handled
      }
      
      // Initialize all components
      this.initializeComponents();
      
      // Initialize scrambling effect
      this.initializeScramblingEffect();
      
      // Show the default section
      this.showSection(this.state.activeSection, true);
      
      // Hide loader
      toggleLoader(false);
    } catch (error) {
      console.error('Failed to initialize application:', error);
      this.showError();
    }
  }
  
  /**
   * Handles URL redirect functionality
   * @returns {boolean} True if redirect was handled, false otherwise
   */
  handleRedirect() {
    const pathSegments = window.location.pathname.split('/').filter(segment => segment);
    
    if (pathSegments.length === 0) return false;
    
    const lastSegment = pathSegments[pathSegments.length - 1];
    if (!lastSegment) return false;
    
    // Find matching link
    const matchingLink = this.config.links.find(link => 
      link.platform.toLowerCase().replace(/[^a-z0-9]/g, '') === 
      lastSegment.toLowerCase().replace(/[^a-z0-9]/g, '')
    );
    
    if (matchingLink) {
      // Show loader with redirect message
      toggleLoader(true);
      const loaderText = document.getElementById('loader-text');
      loaderText.textContent = `Redirecting to ${new URL(matchingLink.url).hostname}...`;
      
      // Redirect after delay
      setTimeout(() => {
        window.location.replace(matchingLink.url);
      }, 100);
      
      return true;
    }
    
    return false;
  }
  
  /**
   * Initializes all UI components
   */
  initializeComponents() {
    // Initialize navigation
    this.initializeNavigation();
    
    // Render all sections
    this.renderAllSections();
    
    // Add performance optimization for rendering
    this.optimizeRendering();
  }
  
  /**
   * Initializes the main navigation
   */
  initializeNavigation() {
    this.elements.navContainer.innerHTML = '';
    
    this.config.navigation.forEach((navItem, index) => {
      const navLink = document.createElement('button');
      navLink.className = 'nav-link';
      navLink.dataset.target = navItem.id;
      navLink.innerHTML = `
        <i class="bi ${navItem.icon}"></i>
        <span class="pb-[3px]">${navItem.name}</span>
      `;
      
      navLink.addEventListener('click', () => {
        this.showSection(navItem.id);
      });
      
      this.elements.navContainer.appendChild(navLink);
    });
  }
  
  /**
   * Initializes search functionality
   */
  initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchClear = document.getElementById('searchClear');
    
    if (searchInput && searchClear) {
      let timeoutId;
      
      searchInput.addEventListener('input', (event) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          this.state.searchQuery = event.target.value.trim();
          searchClear.classList.toggle('hidden', !this.state.searchQuery);
          this.renderLinks(this.filterLinks(this.config.links));
        }, 300); // 300ms debounce
      });
      
      searchClear.addEventListener('click', () => {
        searchInput.value = '';
        this.state.searchQuery = '';
        searchClear.classList.add('hidden');
        this.renderLinks(this.filterLinks(this.config.links));
      });
    }
  }
  
  /**
   * Renders all content sections
   */
  renderAllSections() {
    renderLinksSection(this.config, this.state, this.renderLinks.bind(this));
    renderPortfolioSection(this.config);
    renderExperienceSection(this.config);
    renderProjectsSection(this.config);
    renderContactSection(this.config);
    
    // Initialize search after sections are rendered
    this.initializeSearch();
  }
  
  /**
   * Renders filtered links
   * @param {Array} filteredLinks - Array of links to render
   */
  renderLinks(filteredLinks) {
    const linksGrid = document.getElementById('linksGrid');
    const noResults = document.getElementById('noResults');
    
    linksGrid.innerHTML = '';
    noResults.classList.toggle('hidden', filteredLinks.length > 0);
    
    filteredLinks.forEach((link, index) => {
      // Determine icon based on platform
      const platformKey = link.platform.toLowerCase().replace(/[^a-z0-9]/g, '');
      const iconClass = this.config.iconMap[platformKey] || this.config.iconMap.default;
      
      const linkElement = document.createElement('a');
      linkElement.href = link.url;
      linkElement.target = '_blank';
      linkElement.rel = 'noopener noreferrer';
      linkElement.className = 'group animate-card flex items-center justify-between p-4 bg-white border border-[color:var(--ui-border-base)] rounded-lg shadow-sm hover:shadow-lg hover:border-black hover:-translate-y-1 active:scale-[0.98] transition-all duration-300 ease-in-out';
      linkElement.style.setProperty('--animation-delay', `${30 * index}ms`);
      
      // Highlight search terms if present
      const platformDisplay = this.state.searchQuery 
        ? link.platform.replace(
            new RegExp(`(${this.state.searchQuery.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi'), 
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
   * Shows a specific section and updates navigation
   * @param {string} sectionId - ID of the section to show
   * @param {boolean} skipScroll - Whether to skip scrolling to top
   */
  showSection(sectionId, skipScroll = false) {
    this.state.activeSection = sectionId;
    
    // Hide all sections
    this.elements.contentSections.forEach(section => {
      const isTarget = section.id === sectionId;
      section.classList.toggle('hidden', !isTarget);
      section.classList.toggle('fade-in-section', isTarget);
    });
    
    // Update navigation active state
    document.querySelectorAll('.nav-link').forEach(link => {
      const isTarget = link.dataset.target === sectionId;
      const navItem = this.config.navigation.find(item => item.id === link.dataset.target);
      
      link.classList.toggle('active', isTarget);
      link.querySelector('i').className = `bi ${isTarget ? navItem.activeIcon : navItem.icon}`;
    });
    
    // Scroll to top if not skipping
    if (!skipScroll) {
      scrollToTop();
    }
    
    // Reinitialize scrambling effect for the shown section
    setTimeout(() => {
      this.initializeScramblingEffect();
    }, 50);
  }
  
  /**
   * Initializes the scrambling text effect
   */
  initializeScramblingEffect() {
    // Define selectors for elements that should have scrambling effect
    const selectors = [
      'h1.font-bold',
      '#floating-nav .nav-link span',
      '#categoryFilter button',
      '#linksGrid .group span',
      '#portfolioSection h3',
      '#portfolioSection .mt-4 a',
      '#experienceSection h3',
      '#experienceSection p.text-sm',
      '#projectsSection h3',
      '#projectsSection .mt-4 a',
      '#submitBtn'
    ];
    
    initializeScramblingEffect(selectors);
  }
  
  /**
   * Shows error container when configuration fails to load
   */
  showError() {
    document.getElementById('pageContent').style.display = 'none';
    document.getElementById('floating-nav').style.display = 'none';
    document.getElementById('errorContainer').style.display = 'block';
  }
  
  /**
   * Adds performance optimizations for rendering
   */
  optimizeRendering() {
    // Implement lazy loading for images
    this.setupLazyLoading();
    
    // Optimize animations
    this.optimizeAnimations();
  }
  
  /**
   * Sets up lazy loading for images
   */
  setupLazyLoading() {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          observer.unobserve(img);
        }
      });
    });
    
    // Mark images for lazy loading
    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }
  
  /**
   * Optimizes animations for better performance
   */
  optimizeAnimations() {
    // Use CSS transforms for animations instead of changing layout properties
    const animateCards = document.querySelectorAll('.animate-card');
    animateCards.forEach(card => {
      // Ensure hardware acceleration
      card.style.willChange = 'transform, opacity';
      
      // Clean up after animation
      card.addEventListener('animationend', () => {
        card.style.willChange = 'auto';
      });
    });
  }
  
  /**
   * Filters links based on active category and search query
   * @param {Array} links - Array of link objects to filter
   * @returns {Array} Filtered array of link objects
   */
  filterLinks(links) {
    return links.filter(link => {
      const matchesCategory = this.state.activeCategory === 'all' || link.category === this.state.activeCategory;
      const matchesSearch = !this.state.searchQuery || 
        link.platform.toLowerCase().includes(this.state.searchQuery.toLowerCase());
      
      return matchesCategory && matchesSearch;
    });
  }
}

/**
 * Initialize the application when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', async () => {
  const app = new PortfolioApp();
  await app.init();
});

export default PortfolioApp;