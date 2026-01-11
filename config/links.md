# Links Configuration Guide

This file contains all the links displayed on your portfolio website. Each link has the following properties:

## Properties

- **platform**: The name of the platform/service (e.g., "Facebook", "Twitter", "GitHub")
- **url**: The full URL to the profile or page
- **category**: The category this link belongs to (used for filtering)

## Categories

Available categories and their display names:

- `social` → Social Media
- `professional` → Professional
- `development` → Development
- `writing` → Writing
- `design` → Design
- `support` → Support Me
- `music` → Music
- `productivity` → Productivity
- `gaming` → Gaming
- `crypto` → Crypto
- `links` → Link Aggregators
- `official` → Official
- `ecommerce` → E-Commerce

## Adding New Links

To add a new link, insert a new object in the array with the required properties:

```json
{
  "platform": "Platform Name",
  "url": "https://your-profile-url.com",
  "category": "category-name"
}
```

## Validating Your Changes

- Make sure each link object ends with a comma (except the last one)
- Ensure all URLs are valid and properly formatted
- Use lowercase letters with hyphens for category names
- Test that the link opens correctly in a browser