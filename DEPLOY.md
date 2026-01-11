# Deploying Your Portfolio Website

Learn how to deploy your portfolio website on popular hosting platforms: Vercel, Netlify, Render, and GitHub Pages.

## 🚀 Deployment Options

### 1. Vercel (Recommended)

Vercel is the easiest way to deploy static websites with automatic deployments from Git.

#### Steps:
1. **Prepare your repository**
   - Push your portfolio code to a GitHub, GitLab, or Bitbucket repository
   - Ensure your repository contains all necessary files

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with your GitHub/GitLab/Bitbucket account
   - Click "Add New Project"
   - Select your portfolio repository
   - Click "Deploy"

3. **Configure (if needed)**
   - Framework Preset: Select "Other" or leave as "Auto"
   - Build Command: Leave empty (not needed for static site)
   - Output Directory: `.` (current directory) or leave empty
   - Root Directory: Leave as default

4. **Environment Variables (if using Telegram bot)**
   - Go to Project Settings → Environment Variables
   - Add your Telegram bot token and chat ID as environment variables

5. **Your site is live!**
   - Vercel will provide a URL like `https://your-project.vercel.app`

#### Benefits:
- Instant, global deployment
- Automatic SSL certificates
- Custom domains support
- Automatic deployments from Git

---

### 2. Netlify

Netlify offers easy drag-and-drop deployment and powerful build features.

#### Steps:
1. **Prepare your repository**
   - Push your portfolio code to a GitHub, GitLab, or Bitbucket repository

2. **Deploy to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Sign in and click "Add new site"
   - Choose "Import an existing project"
   - Connect your Git provider
   - Select your repository
   - Click "Deploy"

3. **Configure (if needed)**
   - Build command: Leave empty (not needed for static site)
   - Publish directory: `.` (current directory)

4. **Environment Variables (if using Telegram bot)**
   - Go to Site Settings → Build & Deploy → Environment
   - Add your Telegram bot token and chat ID as environment variables

5. **Your site is live!**
   - Netlify will provide a URL like `https://your-project.netlify.app`

#### Benefits:
- Drag-and-drop deployment option
- Form handling built-in
- Serverless functions support
- Custom domains with free HTTPS

---

### 3. Render

Render provides simple static site hosting with custom domain support.

#### Steps:
1. **Prepare your repository**
   - Push your portfolio code to a GitHub, GitLab, or Bitbucket repository

2. **Deploy to Render**
   - Go to [render.com](https://render.com)
   - Sign up and connect your Git provider
   - Click "New +" and select "Static Site"
   - Choose your repository
   - Configure:
     - Name: Your desired site name
     - Branch: Main branch (usually `main` or `master`)
     - Build command: Leave empty
     - Publish directory: `.` (current directory)

3. **Click "Create Static Site"**

4. **Your site is live!**
   - Render will provide a URL like `https://your-project.onrender.com`

#### Benefits:
- Simple static site hosting
- Automatic SSL certificates
- Custom domains support
- Free tier available

---

### 4. GitHub Pages

Free hosting directly from your GitHub repository.

#### Steps:
1. **Prepare your repository**
   - Ensure your portfolio code is in a GitHub repository
   - Make sure the repository is public

2. **Enable GitHub Pages**
   - Go to your repository on GitHub
   - Navigate to Settings → Pages
   - Under "Source", select "Deploy from a branch"
   - Select your main branch (usually `main` or `master`)
   - Click "Save"

3. **Configure (optional)**
   - If you want to use the `gh-pages` branch instead:
     - Install gh-pages: `npm install gh-pages` (if using npm)
     - Add to package.json: `"deploy": "gh-pages -d ."`

4. **Your site is live!**
   - GitHub will provide a URL like `https://yourusername.github.io/repository-name`

#### Alternative Method - Using gh-pages:
If you prefer to use a separate `gh-pages` branch:

```bash
# Install gh-pages if not already installed
npm install gh-pages

# Deploy to GitHub Pages
npm run deploy
```

#### Benefits:
- Completely free
- Integrated with GitHub
- Custom domains support
- Automatic deployment from Git

---

## ⚙️ Configuration Notes

### For Contact Form (Telegram Bot)
If you're using the contact form with Telegram integration:
- Update `config/telegram.json` with your actual bot token and chat ID
- Be cautious about exposing your bot token in public repositories
- Consider using environment variables on your hosting platform instead

### Custom Domain Setup
All platforms support custom domains:
1. Purchase/obtain your custom domain
2. Add your domain in your hosting platform's dashboard
3. Update your domain's DNS settings as instructed by the platform
4. Wait for DNS propagation (can take up to 48 hours)

### SSL/HTTPS
All mentioned platforms provide free SSL certificates automatically.

---

## 🔄 Continuous Deployment

All platforms offer continuous deployment:
- Changes pushed to your main branch will automatically trigger a new deployment
- You can disable this in the settings if needed
- Preview deployments for pull requests (on some platforms)

---

## 💡 Pro Tips

1. **Test locally first**: Use a local server like `http-server` or `live-server` to test your site locally before deploying
2. **Check paths**: Ensure all asset paths are relative so they work correctly after deployment
3. **Verify contact form**: Test the contact form after deployment if using Telegram integration
4. **Monitor performance**: Use tools like Google PageSpeed Insights to monitor your deployed site's performance
5. **Backup**: Always keep your source code in version control

---

## 🆘 Troubleshooting

**Site not loading properly:**
- Check browser console for errors
- Verify all file paths are correct
- Ensure all required files are included in deployment

**Contact form not working:**
- Verify Telegram bot token and chat ID are correct
- Check browser console for CORS errors
- Some hosting platforms may restrict outgoing requests

**Images not loading:**
- Verify image paths are correct
- Check that image files are included in deployment
- Ensure image formats are supported by browsers

Choose the deployment method that best fits your needs. Vercel and Netlify are recommended for their ease of use and excellent features, while GitHub Pages is great for a completely free solution.