# JavaScript Modules Documentation

This portfolio website uses a modular JavaScript architecture for better maintainability and readability.

## Module Structure

### 1. `app.js` - Main Application Module
The core application module that orchestrates all functionality.

**Classes:**
- `PortfolioApp` - Main application class

**Methods:**
- `constructor()` - Initializes application state and caches DOM elements
- `init()` - Entry point that initializes the entire application
- `handleRedirect()` - Handles URL-based redirects to external links
- `initializeComponents()` - Sets up all UI components
- `initializeNavigation()` - Creates navigation menu from config
- `renderAllSections()` - Renders all content sections
- `renderLinks()` - Renders filtered links
- `showSection(sectionId, skipScroll)` - Displays specified section
- `initializeScramblingEffect()` - Applies text scrambling effect
- `showError()` - Displays error state

### 2. `utils.js` - Utility Functions Module
Contains reusable utility functions.

**Functions:**
- `loadConfig()` - Fetches and combines all configuration files
- `updateSchemaData(links)` - Updates structured data with links
- `getUrlParams()` - Parses URL parameters
- `toggleLoader(show, message)` - Controls loader visibility
- `scrollToTop()` - Smoothly scrolls to top of page

### 3. `ui.js` - UI Components Module
Handles rendering of UI components and user interactions.

**Functions:**
- `initializeScramblingEffect(selectors)` - Applies text scrambling effect to elements
- `renderLinksSection(config, state, renderLinks)` - Creates links section UI
- `initializeSearch(config, state, renderLinks)` - Sets up search functionality
- `initializeCategoryFilter(config, state, renderLinks)` - Sets up category filtering
- `filterLinks(links, state)` - Filters links based on criteria
- `renderLinks(filteredLinks)` - Renders filtered links in grid
- `renderPortfolioSection(config)` - Creates portfolio section
- `renderExperienceSection(config)` - Creates experience section
- `renderProjectsSection(config)` - Creates projects section
- `renderContactSection(config)` - Creates contact section
- `handleSubmit(event, config)` - Processes contact form submission

## Event Handling

The application uses event delegation and modern event handling:

- **Navigation**: Click events on navigation links trigger section switching
- **Search**: Input events on search field filter links in real-time
- **Category Filtering**: Click events on category buttons update filters
- **Form Submission**: Submit events on contact form send data via Telegram API
- **Hover Effects**: Mouse enter/leave events trigger text scrambling effects

## State Management

The application maintains state in the `PortfolioApp` class:

- `activeSection` - Currently displayed section ID
- `searchQuery` - Current search term
- `activeCategory` - Currently selected category filter
- `config` - Loaded configuration data

## Asynchronous Operations

The application handles asynchronous operations gracefully:

- **Configuration Loading**: All config files are fetched in parallel
- **Contact Form**: Telegram API calls are handled with proper error handling
- **Animations**: CSS animations are triggered after content rendering

## Error Handling

The application includes error handling for:

- Failed configuration loading
- Network errors during API calls
- Invalid form submissions
- Missing configuration files

## Best Practices Implemented

- **Modular Design**: Code separated into logical modules
- **ES6+ Features**: Uses modern JavaScript features like modules, arrow functions, destructuring
- **Performance**: Efficient DOM manipulation and event handling
- **Accessibility**: Proper ARIA attributes and keyboard navigation
- **Security**: Input validation and sanitization
- **Maintainability**: Clear function names and comprehensive comments