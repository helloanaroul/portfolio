# Telegram Integration Configuration

This file contains the credentials for Telegram bot integration. This allows visitors to contact you through the contact form on your portfolio.

## Setup Instructions

1. Create a bot with BotFather (@BotFather) on Telegram
2. Get your bot token from BotFather
3. Get your chat ID (you can use @userinfobot to find your ID)
4. Replace the placeholder values in `telegram.json` with your actual credentials

## File Structure

- `botToken`: Your Telegram bot token (keep this secret!)
- `chatId`: The chat ID where messages should be sent

## Security Warning

IMPORTANT: Keep your bot token secret and do not share it publicly! If your repository is public, consider moving this configuration to a server-side endpoint to protect your credentials.