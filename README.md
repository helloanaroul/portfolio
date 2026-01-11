# Professional Portfolio Website

A modern, responsive portfolio website that showcases your professional profile, projects, experience, and social links in an elegant and user-friendly interface.

## Features

- **Responsive Design**: Works beautifully on all devices from mobile to desktop
- **Modular Architecture**: Clean separation of concerns with modular JavaScript
- **Configuration Driven**: All content managed through JSON configuration files
- **SEO Optimized**: Proper meta tags, schema markup, and semantic HTML
- **Accessibility**: WCAG compliant with keyboard navigation and screen reader support
- **Performance Optimized**: Lightweight and fast-loading
- **Contact Integration**: Telegram bot integration for contact form submissions

## Project Structure

```
portfolio-main/
├── config/                 # Configuration files
│   ├── navigation.json     # Navigation menu items
│   ├── ui.json            # UI configuration (icons, categories)
│   ├── links.json         # Social and professional links
│   ├── portfolio.json     # Portfolio items
│   ├── experience.json    # Work experience
│   ├── projects.json      # Project showcase
│   └── telegram.json      # Telegram bot integration
├── css/                   # Stylesheets
│   └── style.css          # Main stylesheet
├── js/                    # JavaScript modules
│   ├── app.js             # Main application module
│   ├── utils.js           # Utility functions
│   ├── ui.js              # UI component functions
│   └── secure.js          # Security features
├── asset/                 # Images and assets
├── library/               # Third-party libraries
├── index.html             # Main HTML file
└── README.md              # Documentation
```

## Configuration Files

### Navigation (`config/navigation.json`)
Controls the main navigation menu. Each item has:
- `id`: Section identifier
- `name`: Display name
- `icon`: Inactive state icon
- `activeIcon`: Active state icon

### UI Configuration (`config/ui.json`)
Contains mappings for:
- `iconMap`: Platform icons
- `categoryNames`: Human-readable category names

### Links (`config/links.json`)
Your social and professional links. Each entry has:
- `platform`: Name of the platform
- `url`: Full URL to profile/page
- `category`: Category for filtering

### Portfolio (`config/portfolio.json`)
Portfolio items. Each entry has:
- `image`: Image URL
- `title`: Item title
- `description`: Short description
- `liveUrl`: Live demo URL
- `detailsUrl`: Details URL

### Experience (`config/experience.json`)
Work experience entries. Each entry has:
- `date`: Employment period
- `title`: Job title
- `company`: Company name
- `icon`: Icon for timeline
- `duties`: Array of job responsibilities

### Projects (`config/projects.json`)
Project showcase. Each entry has:
- `title`: Project title
- `description`: Project description
- `sourceUrl`: Source code URL
- `liveUrl`: Live demo URL
- `tags`: Array of technology tags

### Telegram (`config/telegram.json`)
Integration settings for contact form:
- `botToken`: Telegram bot token
- `chatId`: Chat ID to receive messages

## Getting Started

### Prerequisites

- A web server to host the files
- A Telegram bot token (optional, for contact form)

### Installation

1. Clone or download this repository
2. Customize the configuration files in the `config/` directory
3. Upload the files to your web server

### Customization

#### Adding Links
Edit `config/links.json` and add new entries following the existing format.

#### Updating Profile Information
Modify the metadata in `index.html`:
- Title in `<title>` tag
- Description in meta tags
- Schema.org structured data in the `<script>` tag

#### Changing Colors
Edit the CSS variables in `css/style.css`:
- `--ui-bg-base`: Base background color
- `--ui-bg-component`: Component background
- `--ui-border-base`: Border color
- `--ui-fg-base`: Base text color
- `--ui-fg-muted`: Muted text color
- `--ui-fg-interactive`: Interactive element color

## Security Features

The site includes security measures:
- Right-click prevention (in `secure.js`)
- Developer tools detection
- Secure contact form with Telegram integration

## Performance Tips

- Optimize images in the `asset/` directory
- Minify CSS and JavaScript for production
- Use a CDN for faster loading
- Implement caching strategies

## Browser Support

- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers on iOS and Android

## Contributing

Feel free to fork this repository and submit pull requests for improvements.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.